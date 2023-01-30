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
  radialChart: EChartsOption = {};
  pieChart: EChartsOption = {};

  symbol: string = '';
  totalAssets: number = 0;
  netCashFlow: number = 0;
  revenue: number = 0;
  shareHolderEquity: number = 0;
  CFROA: number = 0;
  CFROE: number = 0;
  CFROS: number = 0;

  constructor(
    private service: AnalysisApiService,
    private fb: FormBuilder,
    private charts: ChartsService
  ) {}

  ngOnInit(): void {
    this.loaderComponent.loading = true;

    this.searchForm = this.fb.group({
      stockSymbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
    });

    this.radialChart = this.charts.radialChart1();
    this.pieChart = this.charts.pieChart();
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

          this.symbol = symbol;
          this.totalAssets = annualTotalAssets[2].reportedValue.raw;
          this.netCashFlow = cashflowStatements[1].changeInCash.raw;
          this.revenue = incomeStatementHistory[1].totalRevenue.raw;
          this.shareHolderEquity =
            annualStockholdersEquity[2].reportedValue.raw;

          // Results
          this.CFROA = (this.netCashFlow / this.totalAssets) * 100;
          this.CFROE = (this.netCashFlow / this.shareHolderEquity) * 100;
          this.CFROS = (this.netCashFlow / this.revenue) * 100;

          this.pieChart = {
            title: [
              {
                text: 'Analysis CFROA, CFROE, CFROS',
                textAlign: 'left',
              },
            ],
            tooltip: {
              trigger: 'item',
            },
            legend: {
              top: 'bottom',
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
                type: 'pie',
                radius: [70, 115],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 8,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                label: {
                  show: false,
                  position: 'center',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 'bold',
                  },
                },
                labelLine: {
                  show: false,
                },
                data: [
                  { value: Math.abs(this.CFROA), name: 'CFROA' },
                  { value: Math.abs(this.CFROE), name: 'CFROE' },
                  { value: Math.abs(this.CFROS), name: 'CFROS' },
                ],
              },
            ],
          };

          this.radialChart = {
            title: [
              {
                text: 'Revenue vs Net Capital',
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
                data: [this.revenue],
                coordinateSystem: 'polar',
                name: 'Revenue',
              },
              {
                type: 'bar',
                data: [this.netCashFlow],
                coordinateSystem: 'polar',
                name: 'Net Capital',
              },
            ],
            legend: {
              show: true,
              top: 'bottom',
              data: ['Revenue', 'Net Capital'],
            },
          };
        });
    }
  }
}
