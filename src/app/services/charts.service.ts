import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  radar: EChartsOption = {};
  pie: EChartsOption = {};
  bar: EChartsOption = {};
  radial1: EChartsOption = {};
  radial2: EChartsOption = {};

  constructor() {}

  radarChart(): any {
    return (this.radar = {
      title: [
        {
          text: 'Analysis',
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
        data: ['Values'],
      },
      radar: {
        indicator: [
          { name: 'Value 1' },
          { name: 'Value 2' },
          { name: 'Value 3' },
          { name: 'Value 4' },
          { name: 'Value 5' },
        ],
      },
      series: [
        {
          name: 'Title',
          type: 'radar',
          data: [
            {
              value: [120, 140, 110, 90, 130],
              name: 'Values',
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
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          interval: 50,
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
        data: ['Value'],
        axisLabel: {
          rotate: 75,
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
          data: [100],
          coordinateSystem: 'polar',
          name: 'Value 1',
        },
        {
          type: 'bar',
          data: [135],
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
