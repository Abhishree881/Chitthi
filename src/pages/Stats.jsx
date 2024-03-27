import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import BarChart from "../components/BarChart";

export default function Stats() {
  const [mood, setMood] = useState({});
  const [load, setLoad] = useState(false);
  useEffect(() => {
    // axios()
    getApiData();
  }, []);
  //   console.log(Object.values(mood));
  //   console.log(Object.keys(mood));
  const getApiData = async () => {
    setLoad(true);
    const response = await fetch(
      "https://chitthi-abhi881.koyeb.app/api"
    ).then((response) => response.json());
    setLoad(false);
    // console.log(response)
    setMood(response);
  };
  const data = Object.values(mood);
  const labels = Object.keys(mood);
  let sum = 0;
  for (const i in data) {
    sum += data[i];
  }
  for (const i in data) {
    data[i] = ((data[i] / sum) * 100).toFixed(2);
  }

  // -----------------UI-----------------
  const barData = {
    labels: labels.map((i) => i),
    datasets: [
      {
        label: "Mood",
        data: data.map((i) => i),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  // console.log(barData);

  // -----------------UI-----------------

  return (
    <div className="stats-page">
      <div className="header">
        {load ? <h1>Loading... </h1> : <h1>Overall Mood Status on the App</h1>}
      </div>
      <div className="main-stats">
        <div className="flex">
          {labels.map((i) => {
            return (
              <div className="stats">
                <p>{i} </p>
                <p>{data[labels.indexOf(i)]} %</p>
              </div>
            );
          })}
        </div>
        <div className="chart">
          <BarChart chartData={barData} />
        </div>
      </div>
    </div>
  );
}
