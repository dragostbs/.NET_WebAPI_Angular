import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { Observable } from 'rxjs';
import { CalcMaService } from './calc-ma.service';
import { CandlesApiService } from './candles-api.service';
import { ChartsService } from './charts.service';

@Injectable({
  providedIn: 'root',
})
export class CandlesChartService {
  searchForm!: FormGroup;
  candlesChart: EChartsOption = {};

  constructor(
    private charts: ChartsService,
    private dataCandles: CandlesApiService,
    private calcMA: CalcMaService
  ) {}

  fetchCandlesData(stockSymbol: string) {
    return this.dataCandles.getCandlesData(stockSymbol);
  }

  displayCandles(formGroup: FormGroup): Observable<EChartsOption> {
    return new Observable((observer) => {
      let dates: string[] = [];
      let ticker: any[] = [];
      let closePrice: any[] = [];
      let maxData: any[] = [];
      let minData: any[] = [];
      let volume: any[] = [];

      if (formGroup.valid) {
        this.fetchCandlesData(formGroup.value['stockSymbol']).subscribe(
          (data) => {
            if (Object.entries(data).length === 0)
              alert('🌋 The Stock could not be found !!!');

            // Push data
            for (let [key, value] of Object.entries(data)) {
              dates.push(key);
              ticker.push([value.Open, value.Close, value.Low, value.High]);
              closePrice.push(value.Close);
              maxData.push([key, value.High]);
              minData.push([key, value.Low]);
              volume.push(value.Volume);
            }

            this.candlesChart = {
              title: {
                text: 'Daily Chart',
                left: 0,
              },
              legend: {
                data: ['Chart', 'Volume', 'MA 21', 'MA 50', 'MA 100'],
                inactiveColor: '#777',
              },
              grid: [
                {
                  left: '5%',
                  right: '2%',
                  height: '70%',
                },
                {
                  left: '5%',
                  right: '2%',
                  top: '84%',
                  height: '7%',
                },
              ],
              xAxis: [
                {
                  data: dates,
                  axisLine: { lineStyle: { color: '#8392A5' } },
                },
                {
                  type: 'category',
                  gridIndex: 1,
                  data: volume,
                  boundaryGap: false,
                  axisLine: { onZero: false },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  axisLabel: { show: false },
                },
              ],
              yAxis: [
                {
                  scale: true,
                  axisLine: { lineStyle: { color: '#8392A5' } },
                },
                {
                  scale: true,
                  gridIndex: 1,
                  splitNumber: 2,
                  axisLabel: { show: false },
                  axisLine: { show: false },
                  axisTick: { show: false },
                  splitLine: { show: false },
                },
              ],
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
                  name: 'Volume',
                  data: volume,
                  type: 'bar',
                  xAxisIndex: 1,
                  yAxisIndex: 1,
                  itemStyle: {
                    color: '#5ba0c7',
                  },
                  large: true,
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
                  xAxisIndex: [0, 1],
                  start: 20,
                  end: 100,
                },
                {
                  show: true,
                  xAxisIndex: [0, 1],
                  type: 'slider',
                  start: 50,
                  end: 100,
                },
              ],
            };
            formGroup.reset({
              stockSymbol: '',
            });
            observer.next(this.candlesChart);
          }
        );
      }
    });
  }

  autoDisplay() {
    this.candlesChart = this.charts.candlesChart();
    return this.candlesChart;
  }
}
