import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AnalysisApiService } from '../services/analysis-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartsService } from '../services/charts.service';
import { Router } from '@angular/router';
import { LoadService } from '../loading/load.service';
import { Cash, cashData } from '../interfaces/interfaces';
import { CandlesChartService } from '../services/candles-chart.service';

@Component({
  selector: 'app-analysis-cash',
  templateUrl: './analysis-cash.component.html',
  styleUrls: ['./analysis-cash.component.scss'],
})
export class AnalysisCashComponent implements OnInit {
  searchForm!: FormGroup;
  barChart: EChartsOption = {};
  lineChart: EChartsOption = {};
  loadingElement: EChartsOption = {};
  candlesChart: EChartsOption = {};

  cash: Cash = cashData;

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

    this.lineChart = this.charts.lineChart();
    this.barChart = this.charts.barChart();
    this.loadingElement = this.charts.loadingElement();

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
              timeSeries: { annualInventory },
            }: any = data;

            let {
              incomeStatementHistory: { incomeStatementHistory },
            }: any = data;

            let {
              balanceSheetHistory: { balanceSheetStatements },
            }: any = data;

            let {
              timeSeries: { annualAccountsPayable },
            }: any = data;

            // Reversing values
            annualInventory.reverse();
            annualAccountsPayable.reverse();

            // Push values
            this.cash.symbol = symbol;
            this.cash.capitalization = marketCap.fmt;

            this.cash.date.length = 0;
            for (let value of annualInventory) {
              this.cash.date.push(value.asOfDate);
            }

            this.cash.inventory.length = 0;
            for (let value of annualInventory) {
              this.cash.inventory.push(value.reportedValue.raw);
            }

            this.cash.cogs.length = 0;
            for (let value of incomeStatementHistory) {
              this.cash.cogs.push(value.costOfRevenue.raw);
            }

            this.cash.revenue.length = 0;
            for (let value of incomeStatementHistory) {
              this.cash.revenue.push(value.totalRevenue.raw);
            }

            this.cash.receivables.length = 0;
            for (let value of balanceSheetStatements) {
              this.cash.receivables.push(value.netReceivables.raw);
            }

            this.cash.accountsPayable.length = 0;
            for (let value of annualAccountsPayable) {
              this.cash.accountsPayable.push(value.reportedValue.raw);
            }

            //Results
            this.cash.DIO.length = 0;
            for (let i = 0; i < this.cash.inventory.length; i++) {
              this.cash.DIO.push(
                (this.cash.inventory[i] / this.cash.cogs[i]) * 365
              );
            }

            this.cash.DSO.length = 0;
            for (let i = 0; i < this.cash.receivables.length; i++) {
              this.cash.DSO.push(
                (this.cash.receivables[i] / this.cash.revenue[i]) * 365
              );
            }

            this.cash.DPO.length = 0;
            for (let i = 0; i < this.cash.accountsPayable.length; i++) {
              this.cash.DPO.push(
                (this.cash.accountsPayable[i] / this.cash.cogs[i]) * 365
              );
            }

            this.cash.CCC.length = 0;
            for (let i = 0; i < this.cash.DIO.length; i++) {
              this.cash.CCC.push(
                this.cash.DIO[i] + this.cash.DSO[i] - this.cash.DPO[i]
              );
            }
          } catch (error: any) {
            alert('🌋 Insufficient data to analyse the stock !!!');
            this.router.navigate(['/analysisCash']);
            location.reload();
          }

          // Check if there is enough data to analyze
          if (
            [
              this.cash.inventory,
              this.cash.cogs,
              this.cash.revenue,
              this.cash.receivables,
              this.cash.accountsPayable,
            ].some((array) => array.length < 4) ||
            [
              ...this.cash.inventory,
              ...this.cash.cogs,
              ...this.cash.revenue,
              ...this.cash.receivables,
              ...this.cash.accountsPayable,
            ].some((value) => value === 0)
          ) {
            alert(
              '🌋 Insufficient data or invalid data to analyse the stock !!!'
            );
            this.loadingEffect();
            this.router.navigate(['/analysisCash']);
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
                'Inventory',
                'Receivables',
                'Cogs',
                'Revenue',
                'Accounts Payable',
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
                name: 'Inventory',
                type: 'bar',
                data: [...this.cash.inventory].reverse(),
              },
              {
                name: 'Receivables',
                type: 'bar',
                data: [...this.cash.receivables].reverse(),
              },
              {
                name: 'Cogs',
                type: 'bar',
                data: [...this.cash.cogs].reverse(),
              },
              {
                name: 'Revenue',
                type: 'bar',
                data: [...this.cash.revenue].reverse(),
              },
              {
                name: 'Accounts Payable',
                type: 'bar',
                data: [...this.cash.accountsPayable].reverse(),
              },
            ],
          };

          this.lineChart = {
            title: {
              text: 'DIO vs DSO vs DPO',
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
              data: ['DIO', 'DSO', 'DPO'],
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
                name: 'DIO',
                type: 'line',
                data: [...this.cash.DIO].reverse(),
              },
              {
                name: 'DSO',
                type: 'line',
                data: [...this.cash.DSO].reverse(),
              },
              {
                name: 'DPO',
                type: 'line',
                data: [...this.cash.DPO].reverse(),
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
    this.loadingService.setLoadingEffect(1000);
  }
}
