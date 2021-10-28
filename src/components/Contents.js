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
  const [cityData, setCityData] = useState({
    // labels: ["서울", "영광"],
    // datasets: [
    //   {
    //     label: "지역별 확진자 수",
    //     backgroundColor: "grey",
    //     fill: true,
    //     data: [12, 3],
    //   },
    // ],
  });
  const [confirmedData, setConfirmedData] = useState({
    labels: ["확진자", "격리중", "해외유입"],
    datasets: [
      {
        label: "확진자 현황",
        backgroundColor: "grey",
        fill: true,
        data: [12, 5, 4],
      },
    ],
  });

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

  const clickSearch = (e) => {
    let isValid = checkValidDate(
      `${selectedYear}-${selectedMonth}-${selectedDate}`
    );

    if (!isValid) {
      alert("존재하는 날짜를 검색해주세요.");
      return;
    }
    let yyyy = selectedYear;
    let mm = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
    let dd = selectedDate < 10 ? `0${selectedDate}` : selectedDate;

    // getData(`${yyyy}${mm}${dd}`);
    setSearchDate(`${yyyy}${mm}${dd}`);
  };

  useEffect(() => {
    const getData = (dt) => {
      const baseUrl = "openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
      const key =
        "HcvseZAI2To4xVKAVTkYti5g0ixy97Dpnjk5GtVKvJzwEgmTtwYVtAk8PFlX545ZLisNwrFncXKF/EufGVRT/g==";

      axios
        .get(baseUrl, {
          params: {
            serviceKey: key,
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: dt,
            endCreateDt: dt,
          },
        })
        .then((res) => {
          // console.log(res.data.response.body);
          console.log(res.data.response);
          // makeRegionData(res.data.response.body.items.item);
        });
    };

    const makeRegionData = (items) => {
      const city = [];
      const defCnts = [];
      items.forEach((item, idx) => {
        // console.log(item);
        if (idx !== 0 && idx !== items.length - 1) {
          city.push(item.gubun);
          defCnts.push(item.localOccCnt);
        }
      });

      setCityData({
        labels: city,
        datasets: [
          {
            label: "지역별 확진자 수",
            backgroundColor: "grey",
            fill: true,
            data: defCnts,
          },
        ],
      });
    };

    getData();
  }, [searchDate]);

  return (
    <section className="section">
      {/* <h2>국내 코로나 현황</h2> */}

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

      <div className="contents">
        <h4>확진자 현황</h4>
        <div>
          <Bar data={confirmedData} />
        </div>
        <h4>지역별 확진자 수</h4>
        <div>
          <Bar
            data={cityData}
            options={
              // {
              // title: {
              //   display: true,
              //   text: "확진자",
              //   fontSize: 16,
              // },
              // },
              { legend: { display: true, position: "bottom" } }
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Contents;
