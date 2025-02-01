import { useEffect, useRef } from "react";

import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";

import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
} from "echarts/components";

import { UniversalTransition, LabelLayout } from "echarts/features";

import { SVGRenderer } from "echarts/renderers";
import { useGetWorldMapJsonDataQuery } from "../../store/apis/baseAPI/endpoints/worldmap/endpoints";

echarts.use([
  VisualMapComponent,
  ToolboxComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
  MapChart,
]);

export default function WorldMapChart() {
  const { data: mapData } = useGetWorldMapJsonDataQuery();
  const myChartRef = useRef<echarts.EChartsType>();

  useEffect(() => {
    if (mapData) {
      console.log("mapData", mapData);
      const myChart = echarts.init(document.getElementById("map"));

      echarts.registerMap("worldmap", mapData);

      const option: any = {
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
        },
        visualMap: {
          left: "right",
          min: 500000,
          max: 38000000,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
          },
          text: ["High", "Low"],
          calculable: true,
        },
        toolbox: {
          show: true,
          //orient: 'vertical',
          left: "left",
          top: "top",
          feature: {
            restore: {},
            saveAsImage: {},
          },
        },
        series: [
          {
            name: "USA PopEstimates",
            type: "map",
            roam: true,
            map: "worldmap",
            emphasis: {
              label: {
                show: true,
              },
            },
            nameProperty: "postal",
            data: [{ name: "TR", value: 4822023 }],
          },
        ],
      };
      myChart.setOption(option);
      myChartRef.current = myChart;
    }
  }, [mapData]);

  return <div id="map" style={{ width: 1000, height: 1000 }}></div>;
}
