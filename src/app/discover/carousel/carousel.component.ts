import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DiscoverApiService } from 'src/app/services/discover-api.service';

export interface ActiveStocks {
  name: string;
  marketVolume: number;
  marketPrice: number;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  pieChart: EChartsOption = {};
  lineChart: EChartsOption = {};

  constructor(private service: DiscoverApiService) {}

  ngOnInit(): void {
    //   let stockName: any[] = [];
    //   let volume: any[] = [];
    //   let shares: any[] = [];
    //   let marketVolume: any[] = [];
    //   let marketPrice: any[] = [];
    //   // Bar Chart Analysis
    //   this.service.getMostActive().subscribe((data) => {
    //     // Destructuring the data, get quotes from Object
    //     let { quotes }: any = data;
    //     for (let value of quotes) {
    //       stockName.push(value.shortName);
    //       volume.push(value.regularMarketVolume);
    //       shares.push(value.sharesOutstanding);
    //       marketVolume.push({
    //         value: value.regularMarketVolume,
    //         name: value.shortName,
    //       });
    //       marketPrice.push({
    //         value: value.regularMarketPrice,
    //         name: value.shortName,
    //       });
    //     }
    //     this.pieChart = {
    //       title: [
    //         {
    //           text: 'Most Active Stocks by Volume and Price',
    //           left: '50%',
    //           textAlign: 'center',
    //         },
    //       ],
    //       tooltip: {
    //         trigger: 'item',
    //       },
    //       legend: {
    //         top: 'bottom',
    //         textStyle: {
    //           fontSize: '10',
    //         },
    //       },
    //       toolbox: {
    //         show: true,
    //         orient: 'vertical',
    //         feature: {
    //           mark: { show: true },
    //           dataView: { show: true, readOnly: false },
    //           restore: { show: true },
    //           saveAsImage: { show: true },
    //         },
    //       },
    //       series: [
    //         {
    //           type: 'pie',
    //           radius: ['50%', '75%'],
    //           avoidLabelOverlap: false,
    //           center: ['25%', '50%'],
    //           roseType: 'radius',
    //           itemStyle: {
    //             borderRadius: 5,
    //           },
    //           label: {
    //             show: false,
    //             position: 'center',
    //           },
    //           emphasis: {
    //             label: {
    //               show: true,
    //               fontSize: 7,
    //               fontWeight: 'bold',
    //             },
    //           },
    //           labelLine: {
    //             show: false,
    //           },
    //           data: marketVolume.slice(0, 5),
    //         },
    //         {
    //           type: 'pie',
    //           radius: ['50%', '75%'],
    //           avoidLabelOverlap: false,
    //           center: ['75%', '50%'],
    //           roseType: 'radius',
    //           itemStyle: {
    //             borderRadius: 5,
    //           },
    //           label: {
    //             show: false,
    //             position: 'center',
    //           },
    //           emphasis: {
    //             label: {
    //               show: true,
    //               fontSize: 7,
    //               fontWeight: 'bold',
    //             },
    //           },
    //           labelLine: {
    //             show: false,
    //           },
    //           data: marketPrice.slice(0, 5),
    //         },
    //       ],
    //     };
    //     // Line Chart Analysis
    //     this.lineChart = {
    //       color: ['#5470C6', '#EE6666'],
    //       title: [
    //         {
    //           text: 'Most Active Stocks by Volume and Shares',
    //           left: '50%',
    //           textAlign: 'center',
    //         },
    //       ],
    //       legend: {
    //         top: 'bottom',
    //         data: ['Volume', 'Shares'],
    //         textStyle: {
    //           fontSize: '10',
    //         },
    //       },
    //       tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //           type: 'shadow',
    //         },
    //       },
    //       toolbox: {
    //         show: true,
    //         orient: 'vertical',
    //         feature: {
    //           mark: { show: true },
    //           dataView: { show: true, readOnly: false },
    //           restore: { show: true },
    //           saveAsImage: { show: true },
    //         },
    //       },
    //       grid: {
    //         top: 50,
    //         bottom: 50,
    //       },
    //       xAxis: [
    //         {
    //           type: 'category',
    //           data: stockName.slice(0, 5),
    //           axisLabel: {
    //             fontSize: 7,
    //           },
    //         },
    //       ],
    //       yAxis: [
    //         {
    //           type: 'value',
    //           max: 200000000,
    //           axisLabel: {
    //             fontSize: 7,
    //           },
    //         },
    //       ],
    //       series: [
    //         {
    //           name: 'Volume',
    //           type: 'bar',
    //           barWidth: '20%',
    //           data: volume,
    //         },
    //         {
    //           name: 'Shares',
    //           type: 'bar',
    //           barWidth: '20%',
    //           data: shares,
    //         },
    //       ],
    //     };
    //   });
  }
}
