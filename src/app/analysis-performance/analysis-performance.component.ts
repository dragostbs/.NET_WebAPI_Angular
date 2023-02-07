import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';
import { AnalysisApiService } from '../services/analysis-api.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-performance',
  templateUrl: './analysis-performance.component.html',
  styleUrls: ['./analysis-performance.component.scss'],
})
export class AnalysisPerformanceComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  searchForm!: FormGroup;
  radialChart: EChartsOption = {};
  lineChart: EChartsOption = {};

  symbol: string = '';
  capitalization: number = 0;
  date: string[] = ['2022', '2021', '2020', '2019'];
  totalAssets: number[] = [0, 0, 0, 0];
  netIncome: number[] = [0, 0, 0, 0];
  revenue: number[] = [0, 0, 0, 0];
  shareHolderEquity: number[] = [0, 0, 0, 0];
  ROA: number[] = [0, 0, 0, 0];
  ROE: number[] = [0, 0, 0, 0];
  ROS: number[] = [0, 0, 0, 0];
  VRA: number[] = [0, 0, 0, 0];
  AER: number[] = [0, 0, 0, 0];

  constructor(
    private service: AnalysisApiService,
    private fb: FormBuilder,
    private charts: ChartsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      stockSymbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
    });

    this.loaderComponent.start();

    this.radialChart = this.charts.radialChart1();
    this.lineChart = this.charts.lineChart();
  }

  displayData() {
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
            incomeStatementHistory: { incomeStatementHistory },
          }: any = data;

          let {
            timeSeries: { annualStockholdersEquity },
          }: any = data;

          // Reversing values
          annualTotalAssets.reverse();
          annualStockholdersEquity.reverse();

          // Check if there is enough data to analyze
          if (
            annualTotalAssets.length < 4 ||
            this.date.length > 0 ||
            this.revenue.length > 0 ||
            this.totalAssets.length > 0 ||
            this.netIncome.length > 0 ||
            this.shareHolderEquity.length > 0
          ) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisPerformance']);
            location.reload();
          }

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

          this.netIncome.length = 0;
          for (let value of incomeStatementHistory) {
            this.netIncome.push(value.netIncome.raw);
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
          this.ROA.length = 0;
          for (let i = 0; i < this.netIncome.length; i++) {
            this.ROA.push((this.netIncome[i] / this.totalAssets[i]) * 100);
          }

          this.ROE.length = 0;
          for (let i = 0; i < this.netIncome.length; i++) {
            this.ROE.push(
              (this.netIncome[i] / this.shareHolderEquity[i]) * 100
            );
          }

          this.ROS.length = 0;
          for (let i = 0; i < this.netIncome.length; i++) {
            this.ROS.push((this.netIncome[i] / this.revenue[i]) * 100);
          }

          this.VRA.length = 0;
          for (let i = 0; i < this.revenue.length; i++) {
            this.VRA.push(this.revenue[i] / this.totalAssets[i]);
          }

          this.AER.length = 0;
          for (let i = 0; i < this.totalAssets.length; i++) {
            this.AER.push(this.totalAssets[i] / this.shareHolderEquity[i]);
          }

          this.lineChart = {
            title: {
              text: 'ROA vs ROE vs ROS',
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
                data: [...this.ROA].reverse(),
              },
              {
                name: 'ROE',
                type: 'line',
                data: [...this.ROE].reverse(),
              },
              {
                name: 'ROS',
                type: 'line',
                data: [...this.ROS].reverse(),
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
                data: [...this.VRA].reverse(),
                coordinateSystem: 'polar',
                name: 'Assets Turnover',
              },
              {
                type: 'bar',
                data: [...this.AER].reverse(),
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
}
