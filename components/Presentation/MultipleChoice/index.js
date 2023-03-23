import React from "react";
import { Chart } from "react-google-charts";

const renderChartData = (options) => {
  let res = [["Option", "Count"]];
  options.forEach((option) => res.push([option.label, option.data]));
  return res;
};

const MultipleChoicePresentation = (props) => {
  const { question, options, type = "default" } = props;
  const width = type === "default" ? "90%" : "70%";
  const height = type === "default" ? "90%" : "70%";

  return (
    <>
      {type === "preview" ? <p>{question}</p> : <h2>{question}</h2>}
      <Chart
        chartType="Bar"
        width={width}
        height={height}
        data={renderChartData(options)}
      />
    </>
  );
};

export default MultipleChoicePresentation;
