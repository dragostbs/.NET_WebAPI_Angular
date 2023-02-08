import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  radar: EChartsOption = {};
  pie: EChartsOption = {};
  bar: EChartsOption = {};
  line: EChartsOption = {};
  radial1: EChartsOption = {};
  radial2: EChartsOption = {};
  loading: EChartsOption = {};

  constructor() {}

  loadingElement(): any {
    return (this.loading = {
      graphic: {
        elements: [
          {
            type: 'group',
            left: 'center',
            top: 'center',
            children: new Array(7).fill(0).map((val, i) => ({
              type: 'rect',
              x: i * 15,
              shape: {
                x: 0,
                y: -20,
                width: 5,
                height: 40,
              },
              style: {
                fill: '#53575aec',
              },
              keyframeAnimation: {
                duration: 800,
                delay: i * 200,
                loop: true,
                keyframes: [
                  {
                    percent: 0.5,
                    scaleY: 0.3,
                    easing: 'cubicIn',
                  },
                  {
                    percent: 1,
                    scaleY: 1,
                    easing: 'cubicOut',
                  },
                ],
              },
            })),
          },
        ],
      },
    });
  }

  lineChart(): any {
    return (this.line = {
      title: {
        text: 'Analysis',
        textAlign: 'left',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Value 1', 'Value 2', 'Value 3'],
        top: 'bottom',
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: ['Point1', 'Point2', 'Point3', 'Point4'],
        axisLabel: {
          fontSize: 5,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 5,
        },
      },
      series: [
        {
          name: 'Value 1',
          type: 'line',
          stack: 'Total',
          data: [110, 132, 101, 134],
        },
        {
          name: 'Value 2',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234],
        },
        {
          name: 'Value 3',
          type: 'line',
          stack: 'Total',
          data: [190, 180, 189, 254],
        },
      ],
    });
  }

  radarChart(): any {
    return (this.radar = {
      title: [
        {
          text: 'Data Visualisation',
          textAlign: 'left',
        },
      ],
      tooltip: {},
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        top: 'bottom',
        data: ['Value1', 'Value2', 'Value3', 'Value4'],
      },
      radar: {
        indicator: [
          { name: 'Point1' },
          { name: 'Point2' },
          { name: 'Point3' },
          { name: 'Point4' },
          { name: 'Point5' },
        ],
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [1, 5, 6, 7, 8],
              name: 'Value1',
            },
            {
              value: [2, 3, 5, 9, 1],
              name: 'Value2',
            },
            {
              value: [4, 1, 2, 5, 4],
              name: 'Value3',
            },
            {
              value: [1, 3, 9, 6, 5],
              name: 'Value4',
            },
          ],
        },
      ],
    });
  }

  pieChart(): any {
    return (this.pie = {
      title: [
        {
          text: 'Analysis',
          textAlign: 'left',
        },
      ],
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          type: 'pie',
          radius: [70, 115],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 100, name: 'Value 1' },
            { value: 150, name: 'Value 2' },
            { value: 90, name: 'Value 3' },
          ],
        },
      ],
    });
  }

  barChart(): any {
    return (this.bar = {
      title: [
        {
          text: 'Analyisis',
          textAlign: 'left',
        },
      ],
      tooltip: {},
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        top: 'bottom',
        data: ['Value 1', 'Value 2', 'Value 3'],
      },
      xAxis: [
        {
          type: 'category',
          data: ['Value'],
          axisPointer: {
            type: 'shadow',
          },
          axisLabel: {
            fontSize: 5,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          interval: 50,
          axisLabel: {
            fontSize: 5,
          },
        },
      ],
      series: [
        {
          name: 'Value 1',
          type: 'bar',
          data: [80],
        },
        {
          name: 'Value 2',
          type: 'bar',
          data: [140],
        },
        {
          name: 'Value 3',
          type: 'bar',
          data: [110],
        },
      ],
    });
  }

  radialChart1(): any {
    return (this.radial1 = {
      title: [
        {
          text: 'Analysis',
          textAlign: 'left',
        },
      ],
      angleAxis: {
        startAngle: 75,
        axisLabel: {
          fontSize: 7,
        },
      },
      radiusAxis: {
        type: 'category',
        data: ['Value1', 'Value2'],
        axisLabel: {
          rotate: 75,
          fontSize: 5,
        },
      },
      polar: {
        radius: [10, '75%'],
      },
      tooltip: {},
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          type: 'bar',
          data: [100, 120],
          coordinateSystem: 'polar',
          name: 'Value 1',
        },
        {
          type: 'bar',
          data: [131, 110],
          coordinateSystem: 'polar',
          name: 'Value 2',
        },
      ],
      legend: {
        show: true,
        top: 'bottom',
        data: ['Value 1', 'Value 2'],
      },
    });
  }

  radialChart2(): any {
    return (this.radial2 = {
      title: [
        {
          text: 'Analysis',
          textAlign: 'left',
        },
      ],
      polar: {
        radius: [10, '75%'],
      },
      radiusAxis: {
        axisLabel: {
          fontSize: 0,
        },
      },
      angleAxis: {
        type: 'category',
        data: ['value'],
        startAngle: 75,
        axisLabel: {
          fontSize: 7,
        },
      },
      tooltip: {},
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          type: 'bar',
          data: [100],
          coordinateSystem: 'polar',
          name: 'Value 1',
        },
        {
          type: 'bar',
          data: [110],
          coordinateSystem: 'polar',
          name: 'Value 2',
        },
        {
          type: 'bar',
          data: [90],
          coordinateSystem: 'polar',
          name: 'Value 3',
        },
      ],
      legend: {
        show: true,
        top: 'bottom',
        data: ['Value 1', 'Value 2', 'Value 3'],
      },
      animation: true,
    });
  }
}
