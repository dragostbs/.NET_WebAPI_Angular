import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  pieChart: EChartsOption = {};
  lineChart: EChartsOption = {};

  ngOnInit(): void {
    this.displayPie();
    this.displayLine();
  }

  displayPie() {
    this.pieChart = {
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
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          center: ['25%', '50%'],
          itemStyle: {
            borderRadius: 10,
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
            { value: 40, name: 'rose 1' },
            { value: 33, name: 'rose 2' },
            { value: 28, name: 'rose 3' },
            { value: 22, name: 'rose 4' },
            { value: 20, name: 'rose 5' },
            { value: 15, name: 'rose 6' },
          ],
        },
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          center: ['75%', '50%'],
          itemStyle: {
            borderRadius: 10,
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
            { value: 30, name: 'rose 1' },
            { value: 28, name: 'rose 2' },
            { value: 26, name: 'rose 3' },
            { value: 24, name: 'rose 4' },
            { value: 22, name: 'rose 5' },
            { value: 20, name: 'rose 6' },
          ],
        },
      ],
    };
  }

  displayLine() {
    this.lineChart = {
      tooltip: {
        trigger: 'none',
        axisPointer: {
          type: 'cross',
        },
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
      grid: {
        top: 50,
        bottom: 50,
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            onZero: false,
          },
          axisPointer: {
            label: {
              formatter: function (params: any) {
                return (
                  'Precipitation  ' +
                  params.value +
                  (params.seriesData.length
                    ? '：' + params.seriesData[0].data
                    : '')
                );
              },
            },
          },

          // prettier-ignore
          data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12'],
        },
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            onZero: false,
          },
          axisPointer: {
            label: {
              formatter: function (params: any) {
                return (
                  'Precipitation  ' +
                  params.value +
                  (params.seriesData.length
                    ? '：' + params.seriesData[0].data
                    : '')
                );
              },
            },
          },

          // prettier-ignore
          data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Precipitation(2015)',
          type: 'line',
          xAxisIndex: 1,
          smooth: true,
          emphasis: {
            focus: 'series',
          },
          data: [
            2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
          ],
        },
        {
          name: 'Precipitation(2016)',
          type: 'line',
          smooth: true,
          emphasis: {
            focus: 'series',
          },
          data: [
            3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3,
            0.7,
          ],
        },
      ],
    };
  }
}
