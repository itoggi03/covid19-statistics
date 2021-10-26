import React, { useEffect } from "react";
import axios from "axios";

const Contents = () => {
  useEffect(() => {
    const baseUrl = "openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
    const serviceKey =
      "HcvseZAI2To4xVKAVTkYti5g0ixy97Dpnjk5GtVKvJzwEgmTtwYVtAk8PFlX545ZLisNwrFncXKF%2FEufGVRT%2Fg%3D%3D";

    const res = axios.get(baseUrl + "?ServiceKey=" + serviceKey).then((res) => {
      console.log(res.data);
    });
  });

  return (
    <section className="section">
      <h2>국내 코로나 현황</h2>
      <div className="contents"></div>
    </section>
  );
};

export default Contents;
