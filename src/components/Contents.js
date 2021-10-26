import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const Contents = () => {
  const [confirmedData, setConfirmedData] = useState({
    labels: ["1월", "2월", "3월"],
    datasets: [
      {
        label: "국내 누적 확진자",
        backgroundColor: "grey",
        fill: true,
        data: [10, 5, 3],
      },
    ],
  });

  useEffect(() => {
    const getData = () => {
      const baseUrl = "openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
      const serviceKey =
        "HcvseZAI2To4xVKAVTkYti5g0ixy97Dpnjk5GtVKvJzwEgmTtwYVtAk8PFlX545ZLisNwrFncXKF%2FEufGVRT%2Fg%3D%3D";

      axios.get(baseUrl + "?ServiceKey=" + serviceKey).then((res) => {
        console.log(res);
        // makeData(res.data.response.body.items);
      });

      const makeData = (items) => {
        items.forEach((item) => console.log(item));
      };
    };

    getData();
  });

  return (
    <section className="section">
      <h2>국내 코로나 현황</h2>
      <div className="contents">
        <div>
          <Bar
            data={confirmedData}
            options={
              ({ title: { display: true, text: "확진자", fontSize: 16 } },
              { legend: { display: true, position: "bottom" } })
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Contents;
