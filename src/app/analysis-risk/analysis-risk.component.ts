import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
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

  symbol: string = '';
  capitalization: number = 0;
  date: string[] = ['2022', '2021', '2020', '2019'];
  totalAssets: number[] = [0, 0, 0, 0];
  totalLiabilities: number[] = [0, 0, 0, 0];
  currentAssets: number[] = [0, 0, 0, 0];
  currentLiabilities: number[] = [0, 0, 0, 0];
  retainedEarnings: number[] = [0, 0, 0, 0];
  shareHolderEquity: number[] = [0, 0, 0, 0];
  revenue: number[] = [0, 0, 0, 0];
  ebit: number[] = [0, 0, 0, 0];
  workingCapital: number[] = [0, 0, 0, 0];
  A: number[] = [0, 0, 0, 0];
  B: number[] = [0, 0, 0, 0];
  C: number[] = [0, 0, 0, 0];
  D: number[] = [0, 0, 0, 0];
  E: number[] = [0, 0, 0, 0];
  ALTMAN: number[] = [0, 0, 0, 0];

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

          // Check if there is enough data to analyze
          if (this.currentAssets.length < 4) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisRisk']);
            location.reload();
          }

          // Push values
          this.symbol = symbol;
          this.capitalization = marketCap.fmt;

          try {
            this.date.length = 0;
            for (let value of annualTotalAssets) {
              this.date.push(value.asOfDate);
            }

            this.totalAssets.length = 0;
            for (let value of annualTotalAssets) {
              this.totalAssets.push(value.reportedValue.raw);
            }

            this.totalLiabilities.length = 0;
            for (let value of annualTotalLiabilitiesNetMinorityInterest) {
              this.totalLiabilities.push(value.reportedValue.raw);
            }

            this.currentAssets.length = 0;
            for (let value of annualCurrentAssets) {
              this.currentAssets.push(value.reportedValue.raw);
            }

            this.currentLiabilities.length = 0;
            for (let value of annualCurrentLiabilities) {
              this.currentLiabilities.push(value.reportedValue.raw);
            }

            this.retainedEarnings.length = 0;
            for (let value of annualRetainedEarnings) {
              this.retainedEarnings.push(value.reportedValue.raw);
            }

            this.revenue.length = 0;
            for (let value of incomeStatementHistory) {
              this.revenue.push(value.totalRevenue.raw);
            }

            this.shareHolderEquity.length = 0;
            for (let value of annualStockholdersEquity) {
              this.shareHolderEquity.push(value.reportedValue.raw);
            }

            this.ebit.length = 0;
            for (let value of incomeStatementHistory) {
              this.ebit.push(value.ebit.raw);
            }

            // Results
            this.workingCapital.length = 0;
            for (let i = 0; i < this.currentAssets.length; i++) {
              this.workingCapital.push(
                this.currentAssets[i] - this.currentLiabilities[i]
              );
            }

            this.A.length = 0;
            for (let i = 0; i < this.workingCapital.length; i++) {
              this.A.push(this.workingCapital[i] / this.totalAssets[i]);
            }

            this.B.length = 0;
            for (let i = 0; i < this.retainedEarnings.length; i++) {
              this.B.push(this.retainedEarnings[i] / this.totalAssets[i]);
            }

            this.C.length = 0;
            for (let i = 0; i < this.ebit.length; i++) {
              this.C.push(this.ebit[i] / this.totalAssets[i]);
            }

            this.D.length = 0;
            for (let i = 0; i < this.shareHolderEquity.length; i++) {
              this.D.push(this.shareHolderEquity[i] / this.totalLiabilities[i]);
            }

            this.E.length = 0;
            for (let i = 0; i < this.revenue.length; i++) {
              this.E.push(this.revenue[i] / this.totalAssets[i]);
            }

            this.ALTMAN.length = 0;
            for (let i = 0; i < this.A.length; i++) {
              this.ALTMAN.push(
                0.717 * this.A[i] +
                  0.847 * this.B[i] +
                  3.107 * this.C[i] +
                  0.42 * this.D[i] +
                  0.998 * this.E[i]
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisRisk']);
            location.reload();
          }

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
                data: [...this.A].reverse(),
              },
              {
                name: 'B',
                type: 'line',
                data: [...this.B].reverse(),
              },
              {
                name: 'C',
                type: 'line',
                data: [...this.C].reverse(),
              },
              {
                name: 'D',
                type: 'line',
                data: [...this.D].reverse(),
              },
              {
                name: 'E',
                type: 'line',
                data: [...this.E].reverse(),
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
                      this.A[0],
                      this.B[0],
                      this.C[0],
                      this.D[0],
                      this.E[0],
                    ],
                    name: '2022',
                  },
                  {
                    value: [
                      this.A[0],
                      this.B[1],
                      this.C[1],
                      this.D[1],
                      this.E[1],
                    ],
                    name: '2021',
                  },
                  {
                    value: [
                      this.A[2],
                      this.B[2],
                      this.C[2],
                      this.D[2],
                      this.E[2],
                    ],
                    name: '2020',
                  },
                  {
                    value: [
                      this.A[3],
                      this.B[3],
                      this.C[3],
                      this.D[3],
                      this.E[3],
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
