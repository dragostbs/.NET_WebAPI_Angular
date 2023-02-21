import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AnalysisApiService } from '../services/analysis-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartsService } from '../services/charts.service';
import { Router } from '@angular/router';
import { LoadService } from '../loading/load.service';
import { BehaviorSubject } from 'rxjs';
import { CandlesApiService } from '../services/candles-api.service';
import { CalcMaService } from '../services/calc-ma.service';
import {
  CandlesChart,
  candlesData,
  Cash,
  cashData,
} from '../interfaces/interfaces';

@Component({
  selector: 'app-analysis-cash',
  templateUrl: './analysis-cash.component.html',
  styleUrls: ['./analysis-cash.component.scss'],
})
export class AnalysisCashComponent implements OnInit {
  searchForm!: FormGroup;
  barChart: EChartsOption = {};
  lineChart: EChartsOption = {};
  loadingElement: EChartsOption = {};
  candlesChart: EChartsOption = {};

  cash: Cash = cashData;
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
              timeSeries: { annualInventory },
            }: any = data;

            let {
              incomeStatementHistory: { incomeStatementHistory },
            }: any = data;

            let {
              balanceSheetHistory: { balanceSheetStatements },
            }: any = data;

            let {
              timeSeries: { annualAccountsPayable },
            }: any = data;

            // Reversing values
            annualInventory.reverse();
            annualAccountsPayable.reverse();

            // Push values
            this.cash.symbol = symbol;
            this.cash.capitalization = marketCap.fmt;

            this.cash.date.length = 0;
            for (let value of annualInventory) {
              this.cash.date.push(value.asOfDate);
            }

            this.cash.inventory.length = 0;
            for (let value of annualInventory) {
              this.cash.inventory.push(value.reportedValue.raw);
            }

            this.cash.cogs.length = 0;
            for (let value of incomeStatementHistory) {
              this.cash.cogs.push(value.costOfRevenue.raw);
            }

            this.cash.revenue.length = 0;
            for (let value of incomeStatementHistory) {
              this.cash.revenue.push(value.totalRevenue.raw);
            }

            this.cash.receivables.length = 0;
            for (let value of balanceSheetStatements) {
              this.cash.receivables.push(value.netReceivables.raw);
            }

            this.cash.accountsPayable.length = 0;
            for (let value of annualAccountsPayable) {
              this.cash.accountsPayable.push(value.reportedValue.raw);
            }

            //Results
            this.cash.DIO.length = 0;
            for (let i = 0; i < this.cash.inventory.length; i++) {
              this.cash.DIO.push(
                (this.cash.inventory[i] / this.cash.cogs[i]) * 365
              );
            }

            this.cash.DSO.length = 0;
            for (let i = 0; i < this.cash.receivables.length; i++) {
              this.cash.DSO.push(
                (this.cash.receivables[i] / this.cash.revenue[i]) * 365
              );
            }

            this.cash.DPO.length = 0;
            for (let i = 0; i < this.cash.accountsPayable.length; i++) {
              this.cash.DPO.push(
                (this.cash.accountsPayable[i] / this.cash.cogs[i]) * 365
              );
            }

            this.cash.CCC.length = 0;
            for (let i = 0; i < this.cash.DIO.length; i++) {
              this.cash.CCC.push(
                this.cash.DIO[i] + this.cash.DSO[i] - this.cash.DPO[i]
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisCash']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.cash.inventory,
              this.cash.cogs,
              this.cash.revenue,
              this.cash.receivables,
              this.cash.accountsPayable,
            ].some((array) => array.length < 4) ||
            [
              ...this.cash.inventory,
              ...this.cash.cogs,
              ...this.cash.revenue,
              ...this.cash.receivables,
              ...this.cash.accountsPayable,
            ].some((value) => value === 0)
          ) {
            alert(
              '🌋 Insufficient data or invalid data to analyse the stock !!!'
            );
            this.loadingEffect();
            this.router.navigate(['/analysisCash']);
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
                'Inventory',
                'Receivables',
                'Cogs',
                'Revenue',
                'Accounts Payable',
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
                name: 'Inventory',
                type: 'bar',
                data: [...this.cash.inventory].reverse(),
              },
              {
                name: 'Receivables',
                type: 'bar',
                data: [...this.cash.receivables].reverse(),
              },
              {
                name: 'Cogs',
                type: 'bar',
                data: [...this.cash.cogs].reverse(),
              },
              {
                name: 'Revenue',
                type: 'bar',
                data: [...this.cash.revenue].reverse(),
              },
              {
                name: 'Accounts Payable',
                type: 'bar',
                data: [...this.cash.accountsPayable].reverse(),
              },
            ],
          };

          this.lineChart = {
            title: {
              text: 'DIO vs DSO vs DPO',
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
              data: ['DIO', 'DSO', 'DPO'],
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
                name: 'DIO',
                type: 'line',
                data: [...this.cash.DIO].reverse(),
              },
              {
                name: 'DSO',
                type: 'line',
                data: [...this.cash.DSO].reverse(),
              },
              {
                name: 'DPO',
                type: 'line',
                data: [...this.cash.DPO].reverse(),
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
