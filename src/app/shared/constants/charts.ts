import { graphic, EChartsOption } from "echarts"

export const defaultChartConfig: EChartsOption = {
  // color: ["rgb(231, 229, 81)", "rgb(35, 99, 158)", "rgb(255, 255, 255)"],
  grid: {
    top: "10px",
    left: "50px",
    bottom: "80px",
  },
  legend: {
    show: true,
    type: "scroll",
    orient: "horizontal",
    bottom: 0,
    left: 0,
    textStyle: {
      color: "#fff",
      fontSize: "10px",
    },
    itemHeight: 14,
    icon: "circle",
    pageIconColor: "white",
    pageIconInactiveColor: "#666",
    pageTextStyle: {
      color: "white",
    },
  },
  xAxis: {
    axisLine: {
      show: true,
    },
    axisLabel: {
      color: "#fff",
    },
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
  dataZoom: [
    {
      type: "inside",
      start: 95,
      end: 100,
    },
    {
      start: 95,
      end: 100,
      bottom: 35,
      textStyle: {
        color: "white",
      },
      labelFormatter(value: number, valStr: string) {
        const tgl = new Date(valStr)
        return tgl.toLocaleDateString("id-ID")
      },
    },
  ],
  series: [
    {
      name: "Data 1",
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#E7E551",
          },
          {
            offset: 1,
            color: "transparent",
          },
        ]),
      },
    },
    {
      name: "Data 2",
      data: [100, 30, 324, 118, 235, 47, 160],
      type: "line",
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#23639e",
          },
          {
            offset: 1,
            color: "transparent",
          },
        ]),
      },
    },
  ],
}
