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

  symbol: string = '';
  capitalization: number = 0;
  date: string[] = ['2022', '2021', '2020', '2019'];
  inventory: number[] = [0, 0, 0, 0];
  cogs: number[] = [0, 0, 0, 0];
  revenue: number[] = [0, 0, 0, 0];
  receivables: number[] = [0, 0, 0, 0];
  accountsPayable: number[] = [0, 0, 0, 0];
  DIO: number[] = [0, 0, 0, 0];
  DSO: number[] = [0, 0, 0, 0];
  DPO: number[] = [0, 0, 0, 0];
  CCC: number[] = [0, 0, 0, 0];

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
            this.symbol = symbol;
            this.capitalization = marketCap.fmt;

            this.date.length = 0;
            for (let value of annualInventory) {
              this.date.push(value.asOfDate);
            }

            this.inventory.length = 0;
            for (let value of annualInventory) {
              this.inventory.push(value.reportedValue.raw);
            }

            this.cogs.length = 0;
            for (let value of incomeStatementHistory) {
              this.cogs.push(value.costOfRevenue.raw);
            }

            this.revenue.length = 0;
            for (let value of incomeStatementHistory) {
              this.revenue.push(value.totalRevenue.raw);
            }

            this.receivables.length = 0;
            for (let value of balanceSheetStatements) {
              this.receivables.push(value.netReceivables.raw);
            }

            this.accountsPayable.length = 0;
            for (let value of annualAccountsPayable) {
              this.accountsPayable.push(value.reportedValue.raw);
            }

            //Results
            this.DIO.length = 0;
            for (let i = 0; i < this.inventory.length; i++) {
              this.DIO.push((this.inventory[i] / this.cogs[i]) * 365);
            }

            this.DSO.length = 0;
            for (let i = 0; i < this.receivables.length; i++) {
              this.DSO.push((this.receivables[i] / this.revenue[i]) * 365);
            }

            this.DPO.length = 0;
            for (let i = 0; i < this.accountsPayable.length; i++) {
              this.DPO.push((this.accountsPayable[i] / this.cogs[i]) * 365);
            }

            this.CCC.length = 0;
            for (let i = 0; i < this.DIO.length; i++) {
              this.CCC.push(this.DIO[i] + this.DSO[i] - this.DPO[i]);
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisCash']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.inventory,
              this.cogs,
              this.revenue,
              this.receivables,
              this.accountsPayable,
            ].some((array) => array.length < 4) ||
            [
              ...this.inventory,
              ...this.cogs,
              ...this.revenue,
              ...this.receivables,
              ...this.accountsPayable,
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
                data: [...this.inventory].reverse(),
              },
              {
                name: 'Receivables',
                type: 'bar',
                data: [...this.receivables].reverse(),
              },
              {
                name: 'Cogs',
                type: 'bar',
                data: [...this.cogs].reverse(),
              },
              {
                name: 'Revenue',
                type: 'bar',
                data: [...this.revenue].reverse(),
              },
              {
                name: 'Accounts Payable',
                type: 'bar',
                data: [...this.accountsPayable].reverse(),
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
                data: [...this.DIO].reverse(),
              },
              {
                name: 'DSO',
                type: 'line',
                data: [...this.DSO].reverse(),
              },
              {
                name: 'DPO',
                type: 'line',
                data: [...this.DPO].reverse(),
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
