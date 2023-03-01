import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import { Position, positionData } from '../interfaces/interfaces';
import { LoadService } from '../loading/load.service';
import { AnalysisApiService } from '../services/analysis-api.service';
import { CalcMaService } from '../services/calc-ma.service';
import { CandlesApiService } from '../services/candles-api.service';
import { CandlesChartService } from '../services/candles-chart.service';
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

  position: Position = positionData;
  // candles: CandlesChart = candlesData;

  constructor(
    private service: AnalysisApiService,
    private fb: FormBuilder,
    private charts: ChartsService,
    private router: Router,
    public loadingService: LoadService,
    private candleChart: CandlesChartService
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

    this.candlesChart = this.candleChart.autoDisplay();
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
            this.position.symbol = symbol;
            this.position.capitalization = marketCap.fmt;

            this.position.date.length = 0;
            for (let value of annualTotalAssets) {
              this.position.date.push(value.asOfDate);
            }

            this.position.totalAssets.length = 0;
            for (let value of annualTotalAssets) {
              this.position.totalAssets.push(value.reportedValue.raw);
            }

            this.position.netCashFlow.length = 0;
            for (let value of cashflowStatements) {
              this.position.netCashFlow.push(value.changeInCash.raw);
            }

            this.position.revenue.length = 0;
            for (let value of incomeStatementHistory) {
              this.position.revenue.push(value.totalRevenue.raw);
            }

            this.position.shareHolderEquity.length = 0;
            for (let value of annualStockholdersEquity) {
              this.position.shareHolderEquity.push(value.reportedValue.raw);
            }

            // Results
            this.position.CFROA.length = 0;
            for (let i = 0; i < this.position.netCashFlow.length; i++) {
              this.position.CFROA.push(
                (this.position.netCashFlow[i] / this.position.totalAssets[i]) *
                  100
              );
            }

            this.position.CFROE.length = 0;
            for (let i = 0; i < this.position.netCashFlow.length; i++) {
              this.position.CFROE.push(
                (this.position.netCashFlow[i] /
                  this.position.shareHolderEquity[i]) *
                  100
              );
            }

            this.position.CFROS.length = 0;
            for (let i = 0; i < this.position.netCashFlow.length; i++) {
              this.position.CFROS.push(
                (this.position.netCashFlow[i] / this.position.revenue[i]) * 100
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisPosition']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.position.totalAssets,
              this.position.netCashFlow,
              this.position.revenue,
              this.position.shareHolderEquity,
            ].some((array) => array.length < 4) ||
            [
              ...this.position.totalAssets,
              ...this.position.netCashFlow,
              ...this.position.revenue,
              ...this.position.shareHolderEquity,
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
                data: [...this.position.totalAssets].reverse(),
              },
              {
                name: 'Revenue',
                type: 'bar',
                data: [...this.position.revenue].reverse(),
              },
              {
                name: 'Net Cash Flow',
                type: 'bar',
                data: [...this.position.netCashFlow].reverse(),
              },
              {
                name: 'Share Holder Equity',
                type: 'bar',
                data: [...this.position.shareHolderEquity].reverse(),
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
                data: [...this.position.CFROA].reverse(),
              },
              {
                name: 'CFROE',
                type: 'line',
                data: [...this.position.CFROE].reverse(),
              },
              {
                name: 'CFROS',
                type: 'line',
                data: [...this.position.CFROS].reverse(),
              },
            ],
          };
        });
    }
  }

  displayChart() {
    this.candleChart
      .displayCandles(this.searchForm)
      .subscribe((candlesChart) => {
        this.candlesChart = candlesChart;
      });
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
