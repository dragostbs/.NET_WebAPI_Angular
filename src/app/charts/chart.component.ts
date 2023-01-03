import { Component, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  candlesChart: EChartsOption = {};

  ngOnInit(): void {
    this.displayChart();
    this.loaderComponent.loading = true;
  }

  displayChart() {
    this.candlesChart = {
      xAxis: {
        data: [
          '2017-10-24',
          '2017-10-25',
          '2017-10-26',
          '2017-10-27',
          '2017-10-28',
          '2017-10-29',
          '2017-10-30',
          '2017-10-31',
          '2017-11-01',
          '2017-11-02',
          '2017-11-03',
          '2017-11-04',
          '2017-11-05',
          '2017-11-06',
          '2017-11-07',
          '2017-11-08',
          '2017-11-09',
          '2017-11-10',
          '2017-11-11',
          '2017-11-12',
          '2017-11-13',
          '2017-11-14',
        ],
      },
      yAxis: {
        scale: true,
      },
      series: [
        {
          type: 'candlestick',
          data: [
            [141, 148, 140, 148],
            [148, 148, 146, 149],
            [145, 147, 145, 148],
            [147, 146, 145, 150],
            [147, 142, 141, 147],
            [142, 140, 140, 143],
            [142, 142, 141, 143],
            [142, 142, 140, 145],
            [142, 144, 141, 144],
            [149, 145, 144, 149],
            [145, 143, 141, 146],
            [141, 136, 136, 141],
            [136, 134, 133, 137],
            [135, 132, 131, 135],
            [131, 132, 129, 133],
            [132, 135, 132, 136],
            [134, 132, 130, 134],
            [130, 131, 129, 132],
            [131, 130, 128, 131],
            [129, 126, 125, 131],
            [127, 129, 127, 130],
            [128, 129, 127, 129],
          ],
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 0,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: 10,
          start: 0,
          end: 100,
        },
      ],
    };
  }
}
