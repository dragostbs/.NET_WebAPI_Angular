import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';
import { AnalysisApiService } from '../services/analysis-api.service';

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
  barChart: EChartsOption = {};

  symbol: string = '';
  totalAssets: number = 0;
  netIncome: number = 0;
  revenue: number = 0;
  shareHolderEquity: number = 0;
  ROA: number = 0;
  ROE: number = 0;
  ROS: number = 0;
  VRA: number = 0;
  AER: number = 0;

  constructor(private service: AnalysisApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loaderComponent.loading = true;

    this.searchForm = this.fb.group({
      stockSymbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
    });
  }

  displayData() {
    if (this.searchForm.valid) {
      this.service
        .getAnalysis(this.searchForm.value['stockSymbol'])
        .subscribe((data) => {
          if (Object.entries(data).length === 0)
            alert('🌋 The Stock could not be found !!!');

          let { symbol }: any = data;

          let {
            timeSeries: { annualTotalAssets },
          }: any = data;

          let {
            incomeStatementHistory: { incomeStatementHistory },
          }: any = data;

          let {
            timeSeries: { annualStockholdersEquity },
          }: any = data;

          this.symbol = symbol;
          this.totalAssets = annualTotalAssets[2].reportedValue.raw;
          this.netIncome = incomeStatementHistory[1].netIncome.raw;
          this.revenue = incomeStatementHistory[1].totalRevenue.raw;
          this.shareHolderEquity =
            annualStockholdersEquity[2].reportedValue.raw;

          // Results
          this.ROA = (this.netIncome / this.totalAssets) * 100;
          this.ROE = (this.netIncome / this.shareHolderEquity) * 100;
          this.ROS = (this.netIncome / this.revenue) * 100;
          this.VRA = this.revenue / this.totalAssets;
          this.AER = this.totalAssets / this.shareHolderEquity;

          this.barChart = {
            title: [
              {
                text: 'Analyisis ROA, ROE, ROS',
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
              data: ['ROA', 'ROE', 'ROS'],
            },
            xAxis: [
              {
                type: 'category',
                data: ['Value'],
                axisPointer: {
                  type: 'shadow',
                },
              },
            ],
            yAxis: [
              {
                type: 'value',
                min: 0,
                interval: 50,
              },
            ],
            series: [
              {
                name: 'ROA',
                type: 'bar',
                data: [this.ROA],
              },
              {
                name: 'ROE',
                type: 'bar',
                data: [this.ROE],
              },
              {
                name: 'ROS',
                type: 'bar',
                data: [this.ROS],
              },
            ],
          };

          this.radialChart = {
            title: [
              {
                text: 'Assets Turnover vs Equity Multiplier',
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
              data: ['Value'],
              axisLabel: {
                rotate: 75,
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
                data: [this.VRA],
                coordinateSystem: 'polar',
                name: 'Assets Turnover',
              },
              {
                type: 'bar',
                data: [this.AER],
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
