import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import {
  CandlesChart,
  candlesData,
  Liquidity,
  liquidityData,
} from '../interfaces/interfaces';
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

  liquidity: Liquidity = liquidityData;
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
            this.liquidity.symbol = symbol;
            this.liquidity.capitalization = marketCap.fmt;

            this.liquidity.date.length = 0;
            for (let value of annualInventory) {
              this.liquidity.date.push(value.asOfDate);
            }

            this.liquidity.inventory.length = 0;
            for (let value of annualInventory) {
              this.liquidity.inventory.push(value.reportedValue.raw);
            }

            this.liquidity.receivables.length = 0;
            for (let value of balanceSheetStatements) {
              this.liquidity.receivables.push(value.netReceivables.raw);
            }

            this.liquidity.prePaidExpenses.length = 0;
            for (let value of balanceSheetStatements) {
              this.liquidity.prePaidExpenses.push(
                value.deferredLongTermAssetCharges.raw
              );
            }

            this.liquidity.cashOnHand.length = 0;
            for (let value of balanceSheetStatements) {
              this.liquidity.cashOnHand.push(value.cash.raw);
            }

            this.liquidity.assets.length = 0;
            for (let value of annualCurrentAssets) {
              this.liquidity.assets.push(value.reportedValue.raw);
            }

            this.liquidity.liabilities.length = 0;
            for (let value of annualCurrentLiabilities) {
              this.liquidity.liabilities.push(value.reportedValue.raw);
            }

            // Results
            this.liquidity.RLC.length = 0;
            for (let i = 0; i < this.liquidity.assets.length; i++) {
              this.liquidity.RLC.push(
                (this.liquidity.assets[i] / this.liquidity.liabilities[i]) * 100
              );
            }

            this.liquidity.RLI.length = 0;
            for (let i = 0; i < this.liquidity.assets.length; i++) {
              this.liquidity.RLI.push(
                ((this.liquidity.assets[i] - this.liquidity.inventory[i]) /
                  this.liquidity.liabilities[i]) *
                  100
              );
            }

            this.liquidity.TR.length = 0;
            for (let i = 0; i < this.liquidity.prePaidExpenses.length; i++) {
              this.liquidity.TR.push(
                this.liquidity.prePaidExpenses[i] + this.liquidity.cashOnHand[i]
              );
            }

            this.liquidity.RLE.length = 0;
            for (let i = 0; i < this.liquidity.liabilities.length; i++) {
              this.liquidity.RLE.push(
                (this.liquidity.TR[i] / this.liquidity.liabilities[i]) * 100
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisLiquidity']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.liquidity.inventory,
              this.liquidity.prePaidExpenses,
              this.liquidity.cashOnHand,
              this.liquidity.receivables,
              this.liquidity.assets,
              this.liquidity.liabilities,
            ].some((array) => array.length < 4) ||
            [
              ...this.liquidity.inventory,
              ...this.liquidity.prePaidExpenses,
              ...this.liquidity.cashOnHand,
              ...this.liquidity.receivables,
              ...this.liquidity.assets,
              ...this.liquidity.liabilities,
            ].some((value) => value === 0)
          ) {
            alert(
              '🌋 Insufficient data or invalid data to analyse the stock !!!'
            );
            this.loadingEffect();
            this.router.navigate(['/analysisLiquidity']);
            location.reload();
          }

          // Display chart
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
                data: [...this.liquidity.RLE].reverse(),
              },
              {
                name: 'RLI',
                type: 'line',
                data: [...this.liquidity.RLI].reverse(),
              },
              {
                name: 'RLC',
                type: 'line',
                data: [...this.liquidity.RLC].reverse(),
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
                data: [...this.liquidity.assets].reverse(),
                coordinateSystem: 'polar',
                name: 'Assets',
              },
              {
                type: 'bar',
                data: [...this.liquidity.liabilities].reverse(),
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
            this.candles.Volume.push(value.Volume);
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
                data: this.candles.dates,
                axisLine: { lineStyle: { color: '#8392A5' } },
              },
              {
                type: 'category',
                gridIndex: 1,
                data: this.candles.Volume,
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
                name: 'Volume',
                data: this.candles.Volume,
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
