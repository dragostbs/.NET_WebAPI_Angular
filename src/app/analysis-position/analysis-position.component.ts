import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';
import { AnalysisApiService } from '../services/analysis-api.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-position',
  templateUrl: './analysis-position.component.html',
  styleUrls: ['./analysis-position.component.scss'],
})
export class AnalysisPositionComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  searchForm!: FormGroup;
  barChart: EChartsOption = {};
  radarChart: EChartsOption = {};

  symbol: string = '';
  totalAssets: number[] = [];
  netCashFlow: number[] = [];
  revenue: number[] = [];
  shareHolderEquity: number[] = [];
  CFROA2022: number = 0;
  CFROE2022: number = 0;
  CFROS2022: number = 0;
  CFROA2021: number = 0;
  CFROE2021: number = 0;
  CFROS2021: number = 0;

  constructor(
    private service: AnalysisApiService,
    private fb: FormBuilder,
    private charts: ChartsService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      stockSymbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
    });

    this.loaderComponent.start();

    this.barChart = this.charts.barChart();
    this.radarChart = this.charts.radarChart();
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
            cashflowStatementHistory: { cashflowStatements },
          }: any = data;

          let {
            incomeStatementHistory: { incomeStatementHistory },
          }: any = data;

          let {
            timeSeries: { annualStockholdersEquity },
          }: any = data;

          for (let value of annualTotalAssets) {
            this.totalAssets.push(value.reportedValue.raw);
          }

          for (let value of cashflowStatements) {
            this.netCashFlow.push(value.changeInCash.raw);
          }

          for (let value of incomeStatementHistory) {
            this.revenue.push(value.totalRevenue.raw);
          }

          for (let value of annualStockholdersEquity) {
            this.shareHolderEquity.push(value.reportedValue.raw);
          }

          this.symbol = symbol;

          // Results
          this.CFROA2022 = (this.netCashFlow[0] / this.totalAssets[3]) * 100;
          this.CFROA2021 = (this.netCashFlow[1] / this.totalAssets[2]) * 100;
          this.CFROE2022 =
            (this.netCashFlow[0] / this.shareHolderEquity[3]) * 100;
          this.CFROE2021 =
            (this.netCashFlow[1] / this.shareHolderEquity[2]) * 100;
          this.CFROS2022 = (this.netCashFlow[0] / this.revenue[3]) * 100;
          this.CFROS2021 = (this.netCashFlow[1] / this.revenue[2]) * 100;

          this.radarChart = {
            title: [
              {
                text: 'Results 2022 vs 2021',
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
              data: ['2022', '2021'],
            },
            radar: {
              center: ['50%', '60%'],
              indicator: [
                { name: 'CFROA' },
                { name: 'CFROE' },
                { name: 'CFROS' },
              ],
            },
            series: [
              {
                name: 'Title',
                type: 'radar',
                data: [
                  {
                    value: [this.CFROA2022, this.CFROE2022, this.CFROS2022],
                    name: '2022',
                  },
                  {
                    value: [this.CFROA2021, this.CFROE2021, this.CFROS2021],
                    name: '2021',
                  },
                ],
              },
            ],
          };

          this.barChart = {
            title: [
              {
                text: 'Total Assets vs Revenue',
                textAlign: 'left',
              },
            ],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
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
              data: ['2022', '2021'],
            },
            dataset: {
              source: [
                ['Data', '2022', '2021'],
                ['Revenue', this.revenue[3], this.revenue[2]],
                ['Total Assets', this.totalAssets[3], this.totalAssets[2]],
              ],
            },
            xAxis: {
              type: 'category',
            },
            yAxis: {
              axisLabel: {
                fontSize: 5,
              },
            },
            series: [{ type: 'bar' }, { type: 'bar' }],
          };
        });
    }
  }
}
