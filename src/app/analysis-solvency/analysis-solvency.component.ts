import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import {
  CandlesChart,
  candlesData,
  Solvency,
  solvencyData,
} from '../interfaces/interfaces';
import { LoadService } from '../loading/load.service';
import { AnalysisApiService } from '../services/analysis-api.service';
import { CalcMaService } from '../services/calc-ma.service';
import { CandlesApiService } from '../services/candles-api.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-solvency',
  templateUrl: './analysis-solvency.component.html',
  styleUrls: ['./analysis-solvency.component.scss'],
})
export class AnalysisSolvencyComponent implements OnInit {
  searchForm!: FormGroup;
  barChart: EChartsOption = {};
  lineChart: EChartsOption = {};
  loadingElement: EChartsOption = {};
  candlesChart: EChartsOption = {};

  solvency: Solvency = solvencyData;
  candles: CandlesChart = candlesData;

  constructor(
    private service: AnalysisApiService,
    private fb: FormBuilder,
    private charts: ChartsService,
    private router: Router,
    public loadingService: LoadService,
    private dataCandles: CandlesApiService,
    private calcMA: CalcMaService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      stockSymbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
    });

    this.barChart = this.charts.barChart();
    this.lineChart = this.charts.lineChart();
    this.loadingElement = this.charts.loadingElement();
    this.candlesChart = this.charts.candlesChart();

    this.loadingEffect();
  }

  savePDF() {
    this.service.downloadPDF();
  }

  displayData() {
    this.loadingEffect();
    if (this.searchForm.valid) {
      this.service
        .getAnalysis(this.searchForm.value['stockSymbol'])
        .subscribe((data) => {
          if (Object.entries(data).length === 0)
            alert('🌋 The Stock could not be found !!!');

          try {
            // Destruct Data
            let { symbol }: any = data;

            let {
              summaryDetail: { marketCap },
            }: any = data;

            let {
              timeSeries: { annualStockholdersEquity },
            }: any = data;

            let {
              timeSeries: { annualTotalAssets },
            }: any = data;

            let {
              timeSeries: { annualTotalLiabilitiesNetMinorityInterest },
            }: any = data;

            let {
              timeSeries: { annualCurrentLiabilities },
            }: any = data;

            let {
              timeSeries: {
                annualTotalNonCurrentLiabilitiesNetMinorityInterest,
              },
            }: any = data;

            // Reversing values
            annualStockholdersEquity.reverse();
            annualTotalAssets.reverse();
            annualTotalLiabilitiesNetMinorityInterest.reverse();
            annualCurrentLiabilities.reverse();
            annualTotalNonCurrentLiabilitiesNetMinorityInterest.reverse();

            // Push values
            this.solvency.symbol = symbol;
            this.solvency.capitalization = marketCap.fmt;

            this.solvency.date.length = 0;
            for (let value of annualStockholdersEquity) {
              this.solvency.date.push(value.asOfDate);
            }

            this.solvency.shareHolderEquity.length = 0;
            for (let value of annualStockholdersEquity) {
              this.solvency.shareHolderEquity.push(value.reportedValue.raw);
            }

            this.solvency.totalAssets.length = 0;
            for (let value of annualTotalAssets) {
              this.solvency.totalAssets.push(value.reportedValue.raw);
            }

            this.solvency.totalLiabilities.length = 0;
            for (let value of annualTotalLiabilitiesNetMinorityInterest) {
              this.solvency.totalLiabilities.push(value.reportedValue.raw);
            }

            this.solvency.totalCurrLiabilities.length = 0;
            for (let value of annualCurrentLiabilities) {
              this.solvency.totalCurrLiabilities.push(value.reportedValue.raw);
            }

            this.solvency.totalLongLiabilities.length = 0;
            for (let value of annualTotalNonCurrentLiabilitiesNetMinorityInterest) {
              this.solvency.totalLongLiabilities.push(value.reportedValue.raw);
            }

            // Results
            this.solvency.RS.length = 0;
            for (let i = 0; i < this.solvency.totalAssets.length; i++) {
              this.solvency.RS.push(
                ((this.solvency.totalAssets[i] -
                  this.solvency.totalCurrLiabilities[i]) /
                  this.solvency.totalLongLiabilities[i]) *
                  100
              );
            }

            this.solvency.DAR.length = 0;
            for (let i = 0; i < this.solvency.totalLiabilities.length; i++) {
              this.solvency.DAR.push(
                (this.solvency.totalLiabilities[i] /
                  this.solvency.totalAssets[i]) *
                  100
              );
            }

            this.solvency.DER.length = 0;
            for (let i = 0; i < this.solvency.totalLiabilities.length; i++) {
              this.solvency.DER.push(
                (this.solvency.totalLiabilities[i] /
                  this.solvency.shareHolderEquity[i]) *
                  100
              );
            }

            this.solvency.EAR.length = 0;
            for (let i = 0; i < this.solvency.shareHolderEquity.length; i++) {
              this.solvency.EAR.push(
                (this.solvency.shareHolderEquity[i] /
                  this.solvency.totalAssets[i]) *
                  100
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisSolvency']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.solvency.totalAssets,
              this.solvency.totalLiabilities,
              this.solvency.shareHolderEquity,
              this.solvency.totalCurrLiabilities,
              this.solvency.totalLongLiabilities,
            ].some((array) => array.length < 4) ||
            [
              ...this.solvency.totalAssets,
              ...this.solvency.totalLiabilities,
              ...this.solvency.shareHolderEquity,
              ...this.solvency.totalCurrLiabilities,
              ...this.solvency.totalLongLiabilities,
            ].some((value) => value === 0)
          ) {
            alert(
              '🌋 Insufficient data or invalid data to analyse the stock !!!'
            );
            this.loadingEffect();
            this.router.navigate(['/analysisSolvency']);
            location.reload();
          }

          // Display charts
          this.lineChart = {
            title: {
              text: 'RS vs DAR vs DER vs EAR',
              textAlign: 'left',
            },
            tooltip: {
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
            legend: {
              data: ['RS', 'DAR', 'DER', 'EAR'],
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
              data: ['2019', '2020', '2021', '2022'],
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
                name: 'RS',
                type: 'line',
                data: [...this.solvency.RS].reverse(),
              },
              {
                name: 'DAR',
                type: 'line',
                data: [...this.solvency.DAR].reverse(),
              },
              {
                name: 'DER',
                type: 'line',
                data: [...this.solvency.DER].reverse(),
              },
              {
                name: 'EAR',
                type: 'line',
                data: [...this.solvency.EAR].reverse(),
              },
            ],
          };

          this.barChart = {
            title: [
              {
                text: 'Liabilities Stats',
                textAlign: 'left',
              },
            ],
            tooltip: {
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
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true },
              },
            },
            legend: {
              top: 'bottom',
              data: [
                'Total Liabilities',
                'Total Current Liabilities',
                'Total Long Term Liabilities',
              ],
            },
            calculable: true,
            xAxis: [
              {
                type: 'category',
                data: ['2019', '2020', '2021', '2022'],
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
                axisLabel: {
                  fontSize: 5,
                },
              },
            ],
            series: [
              {
                name: 'Total Liabilities',
                type: 'bar',
                data: [...this.solvency.totalLiabilities].reverse(),
              },
              {
                name: 'Total Current Liabilities',
                type: 'bar',
                data: [...this.solvency.totalCurrLiabilities].reverse(),
              },
              {
                name: 'Total Long Term Liabilities',
                type: 'bar',
                data: [...this.solvency.totalLongLiabilities].reverse(),
              },
            ],
          };
        });
    }
  }

  displayChart() {
    if (this.searchForm.valid) {
      this.dataCandles
        .getCandlesData(this.searchForm.value['stockSymbol'])
        .subscribe((data) => {
          if (Object.entries(data).length === 0)
            alert('🌋 The Stock could not be found !!!');

          // Push data
          for (let [key, value] of Object.entries(data)) {
            this.candles.dates.push(key);
            this.candles.ticker.push([
              value.Open,
              value.Close,
              value.Low,
              value.High,
            ]);
            this.candles.closePrice.push(value.Close);
            this.candles.maxData.push([key, value.High]);
            this.candles.minData.push([key, value.Low]);
          }

          this.candlesChart = {
            title: {
              text: 'Daily Chart',
              left: 0,
            },
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
              data: this.candles.dates,
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
                data: this.candles.ticker,
                markPoint: {
                  data: [
                    {
                      name: 'Max Mark',
                      coord: this.calcMA.calculateMax(this.candles.maxData),
                      value: this.calcMA.calculateMax(this.candles.maxData),
                      itemStyle: {
                        color: 'rgb(41,60,85)',
                      },
                    },
                    {
                      name: 'Min Mark',
                      coord: this.calcMA.calculateMin(this.candles.minData),
                      value: this.calcMA.calculateMin(this.candles.minData),
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
                data: this.calcMA.calculateMA(this.candles.closePrice, 21),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                },
              },
              {
                name: 'MA 50',
                type: 'line',
                data: this.calcMA.calculateMA(this.candles.closePrice, 50),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                },
              },
              {
                name: 'MA 100',
                type: 'line',
                data: this.calcMA.calculateMA(this.candles.closePrice, 100),
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
  }

  loadingEffect() {
    this.loadingService.isLoading = new BehaviorSubject<boolean>(true);
    const main = document.getElementById('main');
    if (main) {
      main.style.display = 'none';
    }
    setTimeout(() => {
      this.loadingService.isLoading.next(false);
      if (main) {
        main.style.display = 'block';
      }
    }, 2000);
  }
}
