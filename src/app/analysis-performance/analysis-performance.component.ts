import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Performance, performanceData } from '../interfaces/interfaces';
import { LoadService } from '../loading/load.service';
import { AnalysisApiService } from '../services/analysis-api.service';
import { CandlesChartService } from '../services/candles-chart.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-performance',
  templateUrl: './analysis-performance.component.html',
  styleUrls: ['./analysis-performance.component.scss'],
})
export class AnalysisPerformanceComponent implements OnInit {
  searchForm!: FormGroup;
  radialChart: EChartsOption = {};
  lineChart: EChartsOption = {};
  loadingElement: EChartsOption = {};
  candlesChart: EChartsOption = {};

  performance: Performance = performanceData;

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
        [Validators.required, Validators.minLength(1), Validators.maxLength(5)],
      ],
    });

    this.radialChart = this.charts.radialChart1();
    this.lineChart = this.charts.lineChart();
    this.loadingElement = this.charts.loadingElement();
    this.candlesChart = this.charts.candlesChart();

    this.candlesChart = this.candleChart.autoDisplay();
    this.loadingEffect();
  }

  savePDF() {
    this.service.downloadPDF();
  }

  displayData() {
    this.loadingService.setLoadingStatus(true);
    if (this.searchForm.valid) {
      this.service
        .getAnalysis(this.searchForm.value['stockSymbol'])
        .subscribe((data) => {
          if (Object.entries(data).length === 0)
            alert('🌋 The Stock could not be found !!!');

          this.loadingService.setLoadingStatus(false);

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
              incomeStatementHistory: { incomeStatementHistory },
            }: any = data;

            let {
              timeSeries: { annualStockholdersEquity },
            }: any = data;

            // Reversing values
            annualTotalAssets.reverse();
            annualStockholdersEquity.reverse();

            // Push values
            this.performance.symbol = symbol;
            this.performance.capitalization = marketCap.fmt;

            this.performance.date.length = 0;
            for (let value of annualTotalAssets) {
              this.performance.date.push(value.asOfDate);
            }

            this.performance.totalAssets.length = 0;
            for (let value of annualTotalAssets) {
              this.performance.totalAssets.push(value.reportedValue.raw);
            }

            this.performance.netIncome.length = 0;
            for (let value of incomeStatementHistory) {
              this.performance.netIncome.push(value.netIncome.raw);
            }

            this.performance.revenue.length = 0;
            for (let value of incomeStatementHistory) {
              this.performance.revenue.push(value.totalRevenue.raw);
            }

            this.performance.shareHolderEquity.length = 0;
            for (let value of annualStockholdersEquity) {
              this.performance.shareHolderEquity.push(value.reportedValue.raw);
            }

            // Results
            this.performance.ROA.length = 0;
            for (let i = 0; i < this.performance.netIncome.length; i++) {
              this.performance.ROA.push(
                (this.performance.netIncome[i] /
                  this.performance.totalAssets[i]) *
                  100
              );
            }

            this.performance.ROE.length = 0;
            for (let i = 0; i < this.performance.netIncome.length; i++) {
              this.performance.ROE.push(
                (this.performance.netIncome[i] /
                  this.performance.shareHolderEquity[i]) *
                  100
              );
            }

            this.performance.ROS.length = 0;
            for (let i = 0; i < this.performance.netIncome.length; i++) {
              this.performance.ROS.push(
                (this.performance.netIncome[i] / this.performance.revenue[i]) *
                  100
              );
            }

            this.performance.VRA.length = 0;
            for (let i = 0; i < this.performance.revenue.length; i++) {
              this.performance.VRA.push(
                this.performance.revenue[i] / this.performance.totalAssets[i]
              );
            }

            this.performance.AER.length = 0;
            for (let i = 0; i < this.performance.totalAssets.length; i++) {
              this.performance.AER.push(
                this.performance.totalAssets[i] /
                  this.performance.shareHolderEquity[i]
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisPerformance']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.performance.totalAssets,
              this.performance.netIncome,
              this.performance.revenue,
              this.performance.shareHolderEquity,
            ].some((array) => array.length < 4) ||
            [
              ...this.performance.totalAssets,
              ...this.performance.netIncome,
              ...this.performance.revenue,
              ...this.performance.shareHolderEquity,
            ].some((value) => value === 0)
          ) {
            alert(
              '🌋 Insufficient data or invalid data to analyse the stock !!!'
            );
            this.loadingEffect();
            this.router.navigate(['/analysisPerformance']);
            location.reload();
          }

          // Display chart
          this.lineChart = {
            title: {
              text: 'ROA vs ROE vs ROS',
              textAlign: 'left',
            },
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
            legend: {
              data: ['ROA', 'ROE', 'ROS'],
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
                name: 'ROA',
                type: 'line',
                data: [...this.performance.ROA].reverse(),
              },
              {
                name: 'ROE',
                type: 'line',
                data: [...this.performance.ROE].reverse(),
              },
              {
                name: 'ROS',
                type: 'line',
                data: [...this.performance.ROS].reverse(),
              },
            ],
          };

          this.radialChart = {
            title: [
              {
                text: 'Assets Turnover vs Equity Multiplie',
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
                data: [...this.performance.VRA].reverse(),
                coordinateSystem: 'polar',
                name: 'Assets Turnover',
              },
              {
                type: 'bar',
                data: [...this.performance.AER].reverse(),
                coordinateSystem: 'polar',
                name: 'Equity Multiplier',
              },
            ],
            legend: {
              show: true,
              top: 'bottom',
              data: ['Assets Turnover', 'Equity Multiplier'],
            },
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
    this.loadingService.setLoadingEffect(1000);
  }
}
