import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
import { LoadService } from '../loading/load.service';
import { AnalysisApiService } from '../services/analysis-api.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-solvency',
  templateUrl: './analysis-solvency.component.html',
  styleUrls: ['./analysis-solvency.component.scss'],
})
export class AnalysisSolvencyComponent implements OnInit {
  searchForm!: FormGroup;
  barChart: EChartsOption = {};
  lineChart: EChartsOption = {};
  loadingElement: EChartsOption = {};

  symbol: string = '';
  capitalization: number = 0;
  date: string[] = ['2022', '2021', '2020', '2019'];
  shareHolderEquity: number[] = [0, 0, 0, 0];
  totalAssets: number[] = [0, 0, 0, 0];
  totalLiabilities: number[] = [0, 0, 0, 0];
  totalCurrLiabilities: number[] = [0, 0, 0, 0];
  totalLongLiabilities: number[] = [0, 0, 0, 0];
  RS: number[] = [0, 0, 0, 0];
  DAR: number[] = [0, 0, 0, 0];
  DER: number[] = [0, 0, 0, 0];
  EAR: number[] = [0, 0, 0, 0];

  constructor(
    private service: AnalysisApiService,
    private fb: FormBuilder,
    private charts: ChartsService,
    private router: Router,
    public loadingService: LoadService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      stockSymbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
    });

    this.barChart = this.charts.barChart();
    this.lineChart = this.charts.lineChart();
    this.loadingElement = this.charts.loadingElement();

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

          // Reversing values
          annualStockholdersEquity.reverse();
          annualTotalAssets.reverse();
          annualTotalLiabilitiesNetMinorityInterest.reverse();
          annualCurrentLiabilities.reverse();
          annualTotalNonCurrentLiabilitiesNetMinorityInterest.reverse();

          // Check if there is enough data to analyze
          if (annualTotalAssets.length < 4) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisSolvency']);
            location.reload();
          }

          // Push values
          this.symbol = symbol;
          this.capitalization = marketCap.fmt;

          try {
            this.date.length = 0;
            for (let value of annualStockholdersEquity) {
              this.date.push(value.asOfDate);
            }

            this.shareHolderEquity.length = 0;
            for (let value of annualStockholdersEquity) {
              this.shareHolderEquity.push(value.reportedValue.raw);
            }

            this.totalAssets.length = 0;
            for (let value of annualTotalAssets) {
              this.totalAssets.push(value.reportedValue.raw);
            }

            this.totalLiabilities.length = 0;
            for (let value of annualTotalLiabilitiesNetMinorityInterest) {
              this.totalLiabilities.push(value.reportedValue.raw);
            }

            this.totalCurrLiabilities.length = 0;
            for (let value of annualCurrentLiabilities) {
              this.totalCurrLiabilities.push(value.reportedValue.raw);
            }

            this.totalLongLiabilities.length = 0;
            for (let value of annualTotalNonCurrentLiabilitiesNetMinorityInterest) {
              this.totalLongLiabilities.push(value.reportedValue.raw);
            }

            // Results
            this.RS.length = 0;
            for (let i = 0; i < this.totalAssets.length; i++) {
              this.RS.push(
                ((this.totalAssets[i] - this.totalCurrLiabilities[i]) /
                  this.totalLongLiabilities[i]) *
                  100
              );
            }

            this.DAR.length = 0;
            for (let i = 0; i < this.totalLiabilities.length; i++) {
              this.DAR.push(
                (this.totalLiabilities[i] / this.totalAssets[i]) * 100
              );
            }

            this.DER.length = 0;
            for (let i = 0; i < this.totalLiabilities.length; i++) {
              this.DER.push(
                (this.totalLiabilities[i] / this.shareHolderEquity[i]) * 100
              );
            }

            this.EAR.length = 0;
            for (let i = 0; i < this.shareHolderEquity.length; i++) {
              this.EAR.push(
                (this.shareHolderEquity[i] / this.totalAssets[i]) * 100
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisSolvency']);
            location.reload();
          }

          this.lineChart = {
            title: {
              text: 'RS vs DAR vs DER vs EAR',
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
              data: ['RS', 'DAR', 'DER', 'EAR'],
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
                name: 'RS',
                type: 'line',
                data: [...this.RS].reverse(),
              },
              {
                name: 'DAR',
                type: 'line',
                data: [...this.DAR].reverse(),
              },
              {
                name: 'DER',
                type: 'line',
                data: [...this.DER].reverse(),
              },
              {
                name: 'EAR',
                type: 'line',
                data: [...this.EAR].reverse(),
              },
            ],
          };

          this.barChart = {
            title: [
              {
                text: 'Liabilities Stats',
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
                'Total Liabilities',
                'Total Current Liabilities',
                'Total Long Term Liabilities',
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
                name: 'Total Liabilities',
                type: 'bar',
                data: [...this.totalLiabilities].reverse(),
              },
              {
                name: 'Total Current Liabilities',
                type: 'bar',
                data: [...this.totalCurrLiabilities].reverse(),
              },
              {
                name: 'Total Long Term Liabilities',
                type: 'bar',
                data: [...this.totalLongLiabilities].reverse(),
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
