import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import { LoadService } from '../loading/load.service';
import { AnalysisApiService } from '../services/analysis-api.service';
import { CalcMaService } from '../services/calc-ma.service';
import { CandlesApiService } from '../services/candles-api.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-position',
  templateUrl: './analysis-position.component.html',
  styleUrls: ['./analysis-position.component.scss'],
})
export class AnalysisPositionComponent implements OnInit {
  searchForm!: FormGroup;
  lineChart: EChartsOption = {};
  barChart: EChartsOption = {};
  loadingElement: EChartsOption = {};
  candlesChart: EChartsOption = {};

  symbol: string = '';
  capitalization: number = 0;
  date: string[] = ['2022', '2021', '2020', '2019'];
  totalAssets: number[] = [0, 0, 0, 0];
  netCashFlow: number[] = [0, 0, 0, 0];
  revenue: number[] = [0, 0, 0, 0];
  shareHolderEquity: number[] = [0, 0, 0, 0];
  CFROA: number[] = [0, 0, 0, 0];
  CFROE: number[] = [0, 0, 0, 0];
  CFROS: number[] = [0, 0, 0, 0];

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

    this.lineChart = this.charts.lineChart();
    this.barChart = this.charts.barChart();
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
              cashflowStatementHistory: { cashflowStatements },
            }: any = data;

            let {
              incomeStatementHistory: { incomeStatementHistory },
            }: any = data;

            let {
              timeSeries: { annualStockholdersEquity },
            }: any = data;

            // Reversing values
            annualTotalAssets.reverse();
            annualStockholdersEquity.reverse();

            // Push values
            this.symbol = symbol;
            this.capitalization = marketCap.fmt;

            this.date.length = 0;
            for (let value of annualTotalAssets) {
              this.date.push(value.asOfDate);
            }

            this.totalAssets.length = 0;
            for (let value of annualTotalAssets) {
              this.totalAssets.push(value.reportedValue.raw);
            }

            this.netCashFlow.length = 0;
            for (let value of cashflowStatements) {
              this.netCashFlow.push(value.changeInCash.raw);
            }

            this.revenue.length = 0;
            for (let value of incomeStatementHistory) {
              this.revenue.push(value.totalRevenue.raw);
            }

            this.shareHolderEquity.length = 0;
            for (let value of annualStockholdersEquity) {
              this.shareHolderEquity.push(value.reportedValue.raw);
            }

            // Results
            this.CFROA.length = 0;
            for (let i = 0; i < this.netCashFlow.length; i++) {
              this.CFROA.push(
                (this.netCashFlow[i] / this.totalAssets[i]) * 100
              );
            }

            this.CFROE.length = 0;
            for (let i = 0; i < this.netCashFlow.length; i++) {
              this.CFROE.push(
                (this.netCashFlow[i] / this.shareHolderEquity[i]) * 100
              );
            }

            this.CFROS.length = 0;
            for (let i = 0; i < this.netCashFlow.length; i++) {
              this.CFROS.push((this.netCashFlow[i] / this.revenue[i]) * 100);
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisPosition']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.totalAssets,
              this.netCashFlow,
              this.revenue,
              this.shareHolderEquity,
            ].some((array) => array.length < 4) ||
            [
              ...this.totalAssets,
              ...this.netCashFlow,
              ...this.revenue,
              ...this.shareHolderEquity,
            ].some((value) => value === 0)
          ) {
            alert(
              '🌋 Insufficient data or invalid data to analyse the stock !!!'
            );
            this.loadingEffect();
            this.router.navigate(['/analysisPosition']);
            location.reload();
          }

          // Display chart
          this.barChart = {
            title: [
              {
                text: 'Evolution Stats',
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
                'Total Assets',
                'Revenue',
                'Net Cash Flow',
                'Share Holder Equity',
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
                name: 'Total Assets',
                type: 'bar',
                data: [...this.totalAssets].reverse(),
              },
              {
                name: 'Revenue',
                type: 'bar',
                data: [...this.revenue].reverse(),
              },
              {
                name: 'Net Cash Flow',
                type: 'bar',
                data: [...this.netCashFlow].reverse(),
              },
              {
                name: 'Share Holder Equity',
                type: 'bar',
                data: [...this.shareHolderEquity].reverse(),
              },
            ],
          };

          this.lineChart = {
            title: {
              text: 'CFROA vs CFROE vs CFROS',
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
              data: ['CFROA', 'CFROE', 'CFROS'],
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
                name: 'CFROA',
                type: 'line',
                data: [...this.CFROA].reverse(),
              },
              {
                name: 'CFROE',
                type: 'line',
                data: [...this.CFROE].reverse(),
              },
              {
                name: 'CFROS',
                type: 'line',
                data: [...this.CFROS].reverse(),
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
