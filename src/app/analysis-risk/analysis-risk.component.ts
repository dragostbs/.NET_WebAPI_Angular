import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import {
  CandlesChart,
  candlesData,
  Risk,
  riskData,
} from '../interfaces/interfaces';
import { LoadService } from '../loading/load.service';
import { AnalysisApiService } from '../services/analysis-api.service';
import { CalcMaService } from '../services/calc-ma.service';
import { CandlesApiService } from '../services/candles-api.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-risk',
  templateUrl: './analysis-risk.component.html',
  styleUrls: ['./analysis-risk.component.scss'],
})
export class AnalysisRiskComponent implements OnInit {
  searchForm!: FormGroup;
  radarChart: EChartsOption = {};
  lineChart: EChartsOption = {};
  loadingElement: EChartsOption = {};
  candlesChart: EChartsOption = {};

  risk: Risk = riskData;
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

    this.radarChart = this.charts.radarChart();
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
              timeSeries: { annualTotalAssets },
            }: any = data;

            let {
              timeSeries: { annualTotalLiabilitiesNetMinorityInterest },
            }: any = data;

            let {
              timeSeries: { annualCurrentAssets },
            }: any = data;

            let {
              timeSeries: { annualCurrentLiabilities },
            }: any = data;

            let {
              timeSeries: { annualRetainedEarnings },
            }: any = data;

            let {
              incomeStatementHistory: { incomeStatementHistory },
            }: any = data;

            let {
              timeSeries: { annualStockholdersEquity },
            }: any = data;

            // Reversing values
            annualTotalAssets.reverse();
            annualTotalLiabilitiesNetMinorityInterest.reverse();
            annualCurrentAssets.reverse();
            annualCurrentLiabilities.reverse();
            annualRetainedEarnings.reverse();
            annualStockholdersEquity.reverse();

            // Push values
            this.risk.symbol = symbol;
            this.risk.capitalization = marketCap.fmt;

            this.risk.date.length = 0;
            for (let value of annualTotalAssets) {
              this.risk.date.push(value.asOfDate);
            }

            this.risk.totalAssets.length = 0;
            for (let value of annualTotalAssets) {
              this.risk.totalAssets.push(value.reportedValue.raw);
            }

            this.risk.totalLiabilities.length = 0;
            for (let value of annualTotalLiabilitiesNetMinorityInterest) {
              this.risk.totalLiabilities.push(value.reportedValue.raw);
            }

            this.risk.currentAssets.length = 0;
            for (let value of annualCurrentAssets) {
              this.risk.currentAssets.push(value.reportedValue.raw);
            }

            this.risk.currentLiabilities.length = 0;
            for (let value of annualCurrentLiabilities) {
              this.risk.currentLiabilities.push(value.reportedValue.raw);
            }

            this.risk.retainedEarnings.length = 0;
            for (let value of annualRetainedEarnings) {
              this.risk.retainedEarnings.push(value.reportedValue.raw);
            }

            this.risk.revenue.length = 0;
            for (let value of incomeStatementHistory) {
              this.risk.revenue.push(value.totalRevenue.raw);
            }

            this.risk.shareHolderEquity.length = 0;
            for (let value of annualStockholdersEquity) {
              this.risk.shareHolderEquity.push(value.reportedValue.raw);
            }

            this.risk.ebit.length = 0;
            for (let value of incomeStatementHistory) {
              this.risk.ebit.push(value.ebit.raw);
            }

            // Results
            this.risk.workingCapital.length = 0;
            for (let i = 0; i < this.risk.currentAssets.length; i++) {
              this.risk.workingCapital.push(
                this.risk.currentAssets[i] - this.risk.currentLiabilities[i]
              );
            }

            this.risk.A.length = 0;
            for (let i = 0; i < this.risk.workingCapital.length; i++) {
              this.risk.A.push(
                this.risk.workingCapital[i] / this.risk.totalAssets[i]
              );
            }

            this.risk.B.length = 0;
            for (let i = 0; i < this.risk.retainedEarnings.length; i++) {
              this.risk.B.push(
                this.risk.retainedEarnings[i] / this.risk.totalAssets[i]
              );
            }

            this.risk.C.length = 0;
            for (let i = 0; i < this.risk.ebit.length; i++) {
              this.risk.C.push(this.risk.ebit[i] / this.risk.totalAssets[i]);
            }

            this.risk.D.length = 0;
            for (let i = 0; i < this.risk.shareHolderEquity.length; i++) {
              this.risk.D.push(
                this.risk.shareHolderEquity[i] / this.risk.totalLiabilities[i]
              );
            }

            this.risk.E.length = 0;
            for (let i = 0; i < this.risk.revenue.length; i++) {
              this.risk.E.push(this.risk.revenue[i] / this.risk.totalAssets[i]);
            }

            this.risk.ALTMAN.length = 0;
            for (let i = 0; i < this.risk.A.length; i++) {
              this.risk.ALTMAN.push(
                0.717 * this.risk.A[i] +
                  0.847 * this.risk.B[i] +
                  3.107 * this.risk.C[i] +
                  0.42 * this.risk.D[i] +
                  0.998 * this.risk.E[i]
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisRisk']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.risk.totalAssets,
              this.risk.totalLiabilities,
              this.risk.currentAssets,
              this.risk.currentLiabilities,
              this.risk.retainedEarnings,
              this.risk.shareHolderEquity,
              this.risk.revenue,
              this.risk.ebit,
            ].some((array) => array.length < 4) ||
            [
              ...this.risk.totalAssets,
              ...this.risk.totalLiabilities,
              ...this.risk.currentAssets,
              ...this.risk.currentLiabilities,
              ...this.risk.retainedEarnings,
              ...this.risk.shareHolderEquity,
              ...this.risk.revenue,
              ...this.risk.ebit,
            ].some((value) => value === 0)
          ) {
            alert(
              '🌋 Insufficient data or invalid data to analyse the stock !!!'
            );
            this.loadingEffect();
            this.router.navigate(['/analysisRisk']);
            location.reload();
          }

          // Display charts
          this.lineChart = {
            title: {
              text: 'A vs B vs C vs D vs E',
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
              data: ['A', 'B', 'C', 'D', 'E'],
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
                name: 'A',
                type: 'line',
                data: [...this.risk.A].reverse(),
              },
              {
                name: 'B',
                type: 'line',
                data: [...this.risk.B].reverse(),
              },
              {
                name: 'C',
                type: 'line',
                data: [...this.risk.C].reverse(),
              },
              {
                name: 'D',
                type: 'line',
                data: [...this.risk.D].reverse(),
              },
              {
                name: 'E',
                type: 'line',
                data: [...this.risk.E].reverse(),
              },
            ],
          };

          this.radarChart = {
            title: [
              {
                text: 'A vs B vs C vs D vs E',
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
              data: ['2019', '2020', '2021', '2022'],
            },
            radar: {
              indicator: [
                { name: 'A' },
                { name: 'B' },
                { name: 'C' },
                { name: 'D' },
                { name: 'E' },
              ],
            },
            series: [
              {
                name: 'Budget vs spending',
                type: 'radar',
                data: [
                  {
                    value: [
                      this.risk.A[0],
                      this.risk.B[0],
                      this.risk.C[0],
                      this.risk.D[0],
                      this.risk.E[0],
                    ],
                    name: '2022',
                  },
                  {
                    value: [
                      this.risk.A[0],
                      this.risk.B[1],
                      this.risk.C[1],
                      this.risk.D[1],
                      this.risk.E[1],
                    ],
                    name: '2021',
                  },
                  {
                    value: [
                      this.risk.A[2],
                      this.risk.B[2],
                      this.risk.C[2],
                      this.risk.D[2],
                      this.risk.E[2],
                    ],
                    name: '2020',
                  },
                  {
                    value: [
                      this.risk.A[3],
                      this.risk.B[3],
                      this.risk.C[3],
                      this.risk.D[3],
                      this.risk.E[3],
                    ],
                    name: '2019',
                  },
                ],
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
