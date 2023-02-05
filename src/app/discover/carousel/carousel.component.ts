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
  barChart: EChartsOption = {};

  constructor(private service: DiscoverApiService) {}

  ngOnInit(): void {
    let stockName: any[] = [];
    let regularVolume: any[] = [];
    let volume3Months: any[] = [];
    let volume10Days: any[] = [];
    let marketVolume: any[] = [];
    let marketPrice: any[] = [];

    // Bar Chart Analysis
    this.service.getMostActive().subscribe((data) => {
      // Destructuring the data, get quotes from Object
      let { quotes }: any = data;
      for (let value of quotes) {
        stockName.push(value.shortName);
        regularVolume.push(value.regularMarketVolume);
        volume3Months.push(value.averageDailyVolume3Month);
        volume10Days.push(value.averageDailyVolume10Day);
        marketVolume.push({
          value: value.regularMarketVolume,
          name: value.shortName,
        });
        marketPrice.push({
          value: value.regularMarketPrice,
          name: value.shortName,
        });
      }

      this.pieChart = {
        title: [
          {
            text: 'Most Active Stocks by Volume and Price',
            left: '50%',
            textAlign: 'center',
          },
        ],
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: 'bottom',
          textStyle: {
            fontSize: '7',
          },
        },
        toolbox: {
          show: true,
          orient: 'vertical',
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
            radius: ['50%', '75%'],
            avoidLabelOverlap: false,
            center: ['25%', '50%'],
            itemStyle: {
              borderRadius: 5,
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
                fontSize: 7,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: marketVolume.slice(0, 5),
          },
          {
            type: 'pie',
            radius: ['50%', '75%'],
            avoidLabelOverlap: false,
            center: ['75%', '50%'],
            itemStyle: {
              borderRadius: 5,
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
                fontSize: 7,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: marketPrice.slice(0, 5),
          },
        ],
      };

      // Bar Chart Analysis
      this.barChart = {
        title: [
          {
            text: 'Most Active Stocks by Traded Volume',
            left: '50%',
            textAlign: 'center',
          },
        ],
        legend: {
          top: 'bottom',
          data: ['Regular Volume', '3 Months Volume', '10 Days Volume'],
          textStyle: {
            fontSize: '7',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        toolbox: {
          show: true,
          orient: 'vertical',
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
            boundaryGap: true,
            data: stockName.slice(0, 5),
            axisLabel: {
              fontSize: 5,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              fontSize: 5,
            },
          },
        ],
        series: [
          {
            name: 'Regular Volume',
            type: 'bar',
            data: regularVolume,
          },
          {
            name: '3 Months Volume',
            type: 'bar',
            data: volume3Months,
          },
          {
            name: '10 Days Volume',
            type: 'bar',
            data: volume10Days,
          },
        ],
      };
    });
  }
}
