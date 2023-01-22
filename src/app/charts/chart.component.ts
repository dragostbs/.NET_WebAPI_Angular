import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';
import { CalcMaService } from '../services/calc-ma.service';
import { CandlesApiService } from '../services/candles-api.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  searchForm!: FormGroup;
  candlesChart: EChartsOption = {};

  constructor(
    private dataCandles: CandlesApiService,
    private fb: FormBuilder,
    private calcMA: CalcMaService
  ) {}

  ngOnInit(): void {
    this.loaderComponent.loading = true;

    this.searchForm = this.fb.group({
      stockSymbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
    });

    // Display chart automatically on init
    let dates: string[] = [];
    let ticker: any[] = [];

    let closePrice: any[] = [];
    let maxData: any[] = [];
    let minData: any[] = [];

    this.dataCandles.getCandlesDataInit().subscribe((data) => {
      // Push data
      for (let [key, value] of Object.entries(data)) {
        dates.push(key);
        ticker.push([value.Open, value.Close, value.Low, value.High]);
        closePrice.push(value.Close);
        maxData.push([key, value.High]);
        minData.push([key, value.Low]);
      }

      this.candlesChart = {
        legend: {
          data: ['Chart', 'MA 21', 'MA 50', 'MA 100'],
          inactiveColor: '#777',
        },
        grid: [
          {
            left: '5%',
            right: '2%',
            height: '80%',
          },
        ],
        xAxis: {
          data: dates,
          axisLine: { lineStyle: { color: '#8392A5' } },
        },
        yAxis: {
          scale: true,
          axisLine: { lineStyle: { color: '#8392A5' } },
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
            name: 'Chart',
            type: 'candlestick',
            data: ticker,
            markPoint: {
              data: [
                {
                  name: 'Max Mark',
                  coord: this.calcMA.calculateMax(maxData),
                  value: this.calcMA.calculateMax(maxData),
                  itemStyle: {
                    color: 'rgb(41,60,85)',
                  },
                },
                {
                  name: 'Min Mark',
                  coord: this.calcMA.calculateMin(minData),
                  value: this.calcMA.calculateMin(minData),
                  itemStyle: {
                    color: 'rgb(41,60,85)',
                  },
                },
              ],
            },
          },
          {
            name: 'MA 21',
            type: 'line',
            data: this.calcMA.calculateMA(closePrice, 21),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1,
            },
          },
          {
            name: 'MA 50',
            type: 'line',
            data: this.calcMA.calculateMA(closePrice, 50),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1,
            },
          },
          {
            name: 'MA 100',
            type: 'line',
            data: this.calcMA.calculateMA(closePrice, 100),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1,
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
            type: 'cross',
            lineStyle: {
              color: '#4d4e52',
              width: 1,
              opacity: 0.8,
            },
          },
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100,
          },
          {
            show: true,
            type: 'slider',
            start: 50,
            end: 100,
          },
        ],
      };
    });
  }

  // Display chart based on search input
  displayChart() {
    let dates: string[] = [];
    let ticker: any[] = [];

    let closePrice: any[] = [];
    let maxData: any[] = [];
    let minData: any[] = [];

    if (this.searchForm.valid) {
      this.dataCandles
        .getCandlesData(this.searchForm.value['stockSymbol'])
        .subscribe((data) => {
          if (Object.entries(data).length === 0)
            alert('🌋 The Stock could not be found !!!');

          // Push data
          for (let [key, value] of Object.entries(data)) {
            dates.push(key);
            ticker.push([value.Open, value.Close, value.Low, value.High]);
            closePrice.push(value.Close);
            maxData.push([key, value.High]);
            minData.push([key, value.Low]);
          }

          this.candlesChart = {
            legend: {
              data: ['Chart', 'MA 21', 'MA 50', 'MA 100'],
              inactiveColor: '#777',
            },
            grid: [
              {
                left: '5%',
                right: '2%',
                height: '80%',
              },
            ],
            xAxis: {
              data: dates,
              axisLine: { lineStyle: { color: '#8392A5' } },
            },
            yAxis: {
              scale: true,
              axisLine: { lineStyle: { color: '#8392A5' } },
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
                name: 'Chart',
                type: 'candlestick',
                data: ticker,
                markPoint: {
                  data: [
                    {
                      name: 'Max Mark',
                      coord: this.calcMA.calculateMax(maxData),
                      value: this.calcMA.calculateMax(maxData),
                      itemStyle: {
                        color: 'rgb(41,60,85)',
                      },
                    },
                    {
                      name: 'Min Mark',
                      coord: this.calcMA.calculateMin(minData),
                      value: this.calcMA.calculateMin(minData),
                      itemStyle: {
                        color: 'rgb(41,60,85)',
                      },
                    },
                  ],
                },
              },
              {
                name: 'MA 21',
                type: 'line',
                data: this.calcMA.calculateMA(closePrice, 21),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                },
              },
              {
                name: 'MA 50',
                type: 'line',
                data: this.calcMA.calculateMA(closePrice, 50),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                },
              },
              {
                name: 'MA 100',
                type: 'line',
                data: this.calcMA.calculateMA(closePrice, 100),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                },
              },
            ],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false,
                type: 'cross',
                lineStyle: {
                  color: '#4d4e52',
                  width: 1,
                  opacity: 0.8,
                },
              },
            },
            dataZoom: [
              {
                type: 'inside',
                start: 50,
                end: 100,
              },
              {
                show: true,
                type: 'slider',
                start: 50,
                end: 100,
              },
            ],
          };
          this.searchForm.reset({
            stockSymbol: '',
          });
        });
    }
  }
}
