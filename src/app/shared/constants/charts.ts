import { graphic, EChartsOption } from "echarts"

export const defaultChartConfig: EChartsOption = {
  color: ["rgb(231, 229, 81)", "rgb(35, 99, 158)", "rgb(255, 255, 255)"],
  grid: {
    top: "10px",
    left: "40px",
    bottom: "60px",
  },
  legend: {
    show: true,
    bottom: 0,
    left: 0,
    textStyle: {
      color: "#fff",
      fontSize: "10px",
    },
    itemHeight: 10,
    icon: "circle",
  },
  xAxis: {
    axisLine: {
      show: true,
    },
    axisLabel: {
      color: "#fff",
    },
  },
  yAxis: {
    type: "value",
    splitLine: {
      show: false,
    },
    axisLine: {
      show: true,
    },
    axisLabel: {
      color: "#fff",
    },
  },
}
