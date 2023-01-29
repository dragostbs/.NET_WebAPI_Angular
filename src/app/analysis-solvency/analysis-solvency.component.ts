import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';
import { AnalysisApiService } from '../services/analysis-api.service';

@Component({
  selector: 'app-analysis-solvency',
  templateUrl: './analysis-solvency.component.html',
  styleUrls: ['./analysis-solvency.component.scss'],
})
export class AnalysisSolvencyComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  searchForm!: FormGroup;
  radialChart: EChartsOption = {};
  pieChart: EChartsOption = {};

  symbol: string = '';
  shareHolderEquity: number = 0;
  totalAssets: number = 0;
  totalLiabilities: number = 0;
  totalCurrLiabilities: number = 0;
  totalLongLiabilities: number = 0;
  RS: number = 0;
  DAR: number = 0;
  DER: number = 0;
  EAR: number = 0;

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
            timeSeries: { annualStockholdersEquity },
          }: any = data;

          let {
            timeSeries: { annualTotalAssets },
          }: any = data;

          let {
            timeSeries: { annualTotalLiabilitiesNetMinorityInterest },
          }: any = data;

          let {
            timeSeries: { annualCurrentLiabilities },
          }: any = data;

          let {
            timeSeries: { annualTotalNonCurrentLiabilitiesNetMinorityInterest },
          }: any = data;

          this.symbol = symbol;
          this.shareHolderEquity =
            annualStockholdersEquity[2].reportedValue.raw;
          this.totalAssets = annualTotalAssets[2].reportedValue.raw;
          this.totalLiabilities =
            annualTotalLiabilitiesNetMinorityInterest[2].reportedValue.raw;
          this.totalCurrLiabilities =
            annualCurrentLiabilities[2].reportedValue.raw;
          this.totalLongLiabilities =
            annualTotalNonCurrentLiabilitiesNetMinorityInterest[2].reportedValue.raw;

          // Results
          this.RS =
            ((this.totalAssets - this.totalCurrLiabilities) /
              this.totalLongLiabilities) *
            100;
          this.DAR = (this.totalLiabilities / this.totalAssets) * 100;
          this.DER = (this.totalLiabilities / this.shareHolderEquity) * 100;
          this.EAR = (this.shareHolderEquity / this.totalAssets) * 100;

          this.pieChart = {
            title: [
              {
                text: 'Analysis RS, DAR, DER, EAR',
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
                  { value: this.RS, name: 'RS' },
                  { value: this.DAR, name: 'DAR' },
                  { value: this.DER, name: 'DER' },
                  { value: this.EAR, name: 'EAR' },
                ],
              },
            ],
          };

          this.radialChart = {
            title: [
              {
                text: 'Liabilities Visualization',
                textAlign: 'left',
              },
            ],
            polar: {
              radius: [10, '75%'],
            },
            radiusAxis: {
              axisLabel: {
                fontSize: 0,
              },
            },
            angleAxis: {
              type: 'category',
              data: ['value'],
              startAngle: 75,
              axisLabel: {
                fontSize: 7,
              },
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
                data: [this.totalLiabilities],
                coordinateSystem: 'polar',
                name: 'Total Liabilities',
              },
              {
                type: 'bar',
                data: [this.totalCurrLiabilities],
                coordinateSystem: 'polar',
                name: 'Current Liabilities',
              },
              {
                type: 'bar',
                data: [this.totalLongLiabilities],
                coordinateSystem: 'polar',
                name: 'Long Term Liabilities',
              },
            ],
            legend: {
              show: true,
              top: 'bottom',
              data: [
                'Total Liabilities',
                'Current Liabilities',
                'Long Term Liabilities',
              ],
            },
            animation: true,
          };
        });
    }
  }
}
