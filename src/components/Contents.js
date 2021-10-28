import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const Contents = () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();

  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedDate, setSelectedDate] = useState(date);
  const [searchDate, setSearchDate] = useState();
  const [cityData, setCityData] = useState({});
  const [confirmedData, setConfirmedData] = useState({});

  const months = [...Array(12).keys()].map((key) => key + 1);
  const dates = [...Array(31).keys()].map((key) => key + 1);

  const makeOptions = (arr) => {
    return arr.map((val) => (
      <option value={val} key={val}>
        {val}
      </option>
    ));
  };

  const changeYear = (e) => {
    setSelectedYear(e.target.value);
  };
  const changeMonth = (e) => {
    setSelectedMonth(e.target.value);
  };
  const changeDate = (e) => {
    setSelectedDate(e.target.value);
  };

  // 날짜 유효성 검사
  const checkValidDate = (value) => {
    var result = true;
    try {
      var date = value.split("-");
      var y = parseInt(date[0], 10),
        m = parseInt(date[1], 10),
        d = parseInt(date[2], 10);

      var dateRegex =
        /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
      result = dateRegex.test(d + "-" + m + "-" + y);
    } catch (err) {
      result = false;
    }
    return result;
  };

  // 검색 버튼 눌렀을 경우 날짜 유효성 검사하고 검색날짜 설정
  const clickSearch = (e) => {
    if (selectedYear <= 2020 && selectedMonth <= 4 && selectedDate < 10) {
      alert("2021년 4월 10일 이후의 날짜만 결과를 제공합니다.");
      return;
    }

    if (selectedYear >= year && selectedMonth >= month && selectedDate > date) {
      alert("오늘 날짜까지 검색 가능합니다.");
      return;
    }

    let isValid = checkValidDate(
      `${selectedYear}-${selectedMonth}-${selectedDate}`
    );

    if (!isValid) {
      alert("존재하는 날짜를 검색해주세요.");
      return;
    }

    const yyyy = selectedYear;
    const mm = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
    const dd = selectedDate < 10 ? `0${selectedDate}` : selectedDate;

    setSearchDate(`${yyyy}${mm}${dd}`);
  };

  useEffect(() => {
    const getData = (dt) => {
      const baseUrl = "openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
      const key =
        "HcvseZAI2To4xVKAVTkYti5g0ixy97Dpnjk5GtVKvJzwEgmTtwYVtAk8PFlX545ZLisNwrFncXKF%2FEufGVRT%2Fg%3D%3D";

      const config = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      };

      axios
        .get(
          baseUrl,
          {
            params: {
              ServiceKey: key,
              pageNo: 1,
              numOfRows: 10,
              startCreateDt: dt,
              endCreateDt: dt,
            },
          },
          config
        )
        .then((res) => {
          makeRegionData(res.data.response.body.items.item);
        })
        .catch((err) => {
          alert("데이터를 불러오지 못했어요.");
        });
    };

    const makeRegionData = (items) => {
      const city = [];
      const defCnts = [];
      const totalDefCnt = 0;
      const totalIsoCnt = 0;
      const totalOver = 0;

      items.forEach((item, idx) => {
        if (item.gubun == "합계") {
          totalDefCnt = item.defCnt;
          totalIsoCnt = item.isolIngCnt;
          totalOver = item.overFlowCnt;
        } else if (item.gubun !== "합계" && item.gubun != "검역") {
          city.push(item.gubun);
          defCnts.push(item.localOccCnt);
        }
      });

      setCityData({
        labels: city,
        datasets: [
          {
            label: "지역별 확진자 수",
            backgroundColor: "cadetblue",
            fill: false,
            data: defCnts,
            barThickness: 100,
          },
        ],
      });

      setConfirmedData({
        labels: ["확진자", "격리중", "해외유입"],
        datasets: [
          {
            label: "확진자 현황",
            backgroundColor: "cadetblue",
            fill: false,
            data: [totalDefCnt, totalIsoCnt, totalOver],
            barThickness: 100,
          },
        ],
      });
    };

    getData();
  }, [searchDate]);

  return (
    <section className="section">
      <div className="dateSelect">
        <select name="year" id="" value={selectedYear} onChange={changeYear}>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </select>
        <select name="month" id="" value={selectedMonth} onChange={changeMonth}>
          {makeOptions(months)}
        </select>
        <select name="date" id="" value={selectedDate} onChange={changeDate}>
          {makeOptions(dates)}
        </select>
        <button onClick={clickSearch}>검색</button>
      </div>
      <div className="contents">
        <div className="graph">
          <h4>확진자 현황</h4>
          <div>
            <Bar
              data={confirmedData}
              options={{ legend: { display: true, position: "bottom" } }}
            />
          </div>
        </div>
        <div className="graph">
          <h4>지역별 확진자 수</h4>
          <div>
            <Bar
              data={cityData}
              options={{ legend: { display: true, position: "bottom" } }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contents;
