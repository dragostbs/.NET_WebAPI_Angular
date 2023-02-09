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
  selector: 'app-analysis-liquidity',
  templateUrl: './analysis-liquidity.component.html',
  styleUrls: ['./analysis-liquidity.component.scss'],
})
export class AnalysisLiquidityComponent implements OnInit {
  searchForm!: FormGroup;
  radialChart: EChartsOption = {};
  lineChart: EChartsOption = {};
  loadingElement: EChartsOption = {};
  candlesChart: EChartsOption = {};

  symbol: string = '';
  capitalization: number = 0;
  date: string[] = ['2022', '2021', '2020', '2019'];
  inventory: number[] = [0, 0, 0, 0];
  receivables: number[] = [0, 0, 0, 0];
  prePaidExpenses: number[] = [0, 0, 0, 0];
  cashOnHand: number[] = [0, 0, 0, 0];
  assets: number[] = [0, 0, 0, 0];
  liabillities: number[] = [0, 0, 0, 0];
  RLC: number[] = [0, 0, 0, 0];
  RLI: number[] = [0, 0, 0, 0];
  TR: number[] = [0, 0, 0, 0];
  RLE: number[] = [0, 0, 0, 0];

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

    this.radialChart = this.charts.radialChart1();
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
            timeSeries: { annualInventory },
          }: any = data;

          let {
            balanceSheetHistory: { balanceSheetStatements },
          }: any = data;

          let {
            timeSeries: { annualCurrentAssets },
          }: any = data;

          let {
            timeSeries: { annualCurrentLiabilities },
          }: any = data;

          // Reversing values
          annualInventory.reverse();
          annualCurrentAssets.reverse();
          annualCurrentLiabilities.reverse();

          // Push values
          this.symbol = symbol;
          this.capitalization = marketCap.fmt;

          // Check if there is enough data to analyze
          if (annualInventory.length < 4) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisLiquidity']);
            location.reload();
          }

          try {
            this.date.length = 0;
            for (let value of annualInventory) {
              this.date.push(value.asOfDate);
            }

            this.inventory.length = 0;
            for (let value of annualInventory) {
              this.inventory.push(value.reportedValue.raw);
            }

            this.receivables.length = 0;
            for (let value of balanceSheetStatements) {
              this.receivables.push(value.netReceivables.raw);
            }

            this.prePaidExpenses.length = 0;
            for (let value of balanceSheetStatements) {
              this.prePaidExpenses.push(value.deferredLongTermAssetCharges.raw);
            }

            this.cashOnHand.length = 0;
            for (let value of balanceSheetStatements) {
              this.cashOnHand.push(value.cash.raw);
            }

            this.assets.length = 0;
            for (let value of annualCurrentAssets) {
              this.assets.push(value.reportedValue.raw);
            }

            this.liabillities.length = 0;
            for (let value of annualCurrentLiabilities) {
              this.liabillities.push(value.reportedValue.raw);
            }

            // Results
            this.RLC.length = 0;
            for (let i = 0; i < this.assets.length; i++) {
              this.RLC.push((this.assets[i] / this.liabillities[i]) * 100);
            }

            this.RLI.length = 0;
            for (let i = 0; i < this.assets.length; i++) {
              this.RLI.push(
                ((this.assets[i] - this.inventory[i]) / this.liabillities[i]) *
                  100
              );
            }

            this.TR.length = 0;
            for (let i = 0; i < this.prePaidExpenses.length; i++) {
              this.TR.push(this.prePaidExpenses[i] + this.cashOnHand[i]);
            }

            this.RLE.length = 0;
            for (let i = 0; i < this.liabillities.length; i++) {
              this.RLE.push((this.TR[i] / this.liabillities[i]) * 100);
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisLiquidity']);
            location.reload();
          }

          this.lineChart = {
            title: {
              text: 'RLC vs RLI vs RLE',
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
              data: ['RLC', 'RLI', 'RLE'],
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
                name: 'RLE',
                type: 'line',
                data: [...this.RLE].reverse(),
              },
              {
                name: 'RLI',
                type: 'line',
                data: [...this.RLI].reverse(),
              },
              {
                name: 'RLC',
                type: 'line',
                data: [...this.RLC].reverse(),
              },
            ],
          };

          this.radialChart = {
            title: [
              {
                text: 'Assets vs Liabilities',
                textAlign: 'left',
              },
            ],
            angleAxis: {
              startAngle: 75,
              axisLabel: {
                fontSize: 7,
              },
            },
            radiusAxis: {
              type: 'category',
              data: [2019, 2020, 2021, 2022],
              axisLabel: {
                rotate: 75,
                fontSize: 5,
              },
            },
            polar: {
              radius: [10, '75%'],
            },
            tooltip: {},
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
                type: 'bar',
                data: [...this.assets].reverse(),
                coordinateSystem: 'polar',
                name: 'Assets',
              },
              {
                type: 'bar',
                data: [...this.liabillities].reverse(),
                coordinateSystem: 'polar',
                name: 'Liabilities',
              },
            ],
            legend: {
              show: true,
              top: 'bottom',
              data: ['Assets', 'Liabilities'],
            },
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
