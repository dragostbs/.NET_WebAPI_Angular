import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { EChartsOption } from 'echarts';
import { AnalysisApiService } from '../services/analysis-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-ccc',
  templateUrl: './analysis-ccc.component.html',
  styleUrls: ['./analysis-ccc.component.scss'],
})
export class AnalysisCCCComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  searchForm!: FormGroup;
  barChart: EChartsOption = {};
  lineChart: EChartsOption = {};

  symbol: string = '';
  capitalization: number = 0;
  date: string[] = ['2022', '2021', '2020', '2019'];
  inventory: number[] = [0, 0, 0, 0];
  cogs: number[] = [0, 0, 0, 0];
  revenue: number[] = [0, 0, 0, 0];
  receivables: number[] = [0, 0, 0, 0];
  accountsPayable: number[] = [0, 0, 0, 0];
  DIO: number[] = [0, 0, 0, 0];
  DSO: number[] = [0, 0, 0, 0];
  DPO: number[] = [0, 0, 0, 0];
  CCC: number[] = [0, 0, 0, 0];

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

    this.lineChart = this.charts.lineChart();
    this.barChart = this.charts.barChart();
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
          this.symbol = symbol;
          this.capitalization = marketCap.fmt;

          this.date.length = 0;
          for (let value of annualInventory) {
            this.date.push(value.asOfDate);
          }

          this.inventory.length = 0;
          for (let value of annualInventory) {
            this.inventory.push(value.reportedValue.raw);
          }

          this.cogs.length = 0;
          for (let value of incomeStatementHistory) {
            this.cogs.push(value.costOfRevenue.raw);
          }

          this.revenue.length = 0;
          for (let value of incomeStatementHistory) {
            this.revenue.push(value.totalRevenue.raw);
          }

          this.receivables.length = 0;
          for (let value of balanceSheetStatements) {
            this.receivables.push(value.netReceivables.raw);
          }

          this.accountsPayable.length = 0;
          for (let value of annualAccountsPayable) {
            this.accountsPayable.push(value.reportedValue.raw);
          }

          //Results
          this.DIO.length = 0;
          for (let i = 0; i < this.inventory.length; i++) {
            this.DIO.push((this.inventory[i] / this.cogs[i]) * 365);
          }

          this.DSO.length = 0;
          for (let i = 0; i < this.receivables.length; i++) {
            this.DSO.push((this.receivables[i] / this.revenue[i]) * 365);
          }

          this.DPO.length = 0;
          for (let i = 0; i < this.accountsPayable.length; i++) {
            this.DPO.push((this.accountsPayable[i] / this.cogs[i]) * 365);
          }

          this.CCC.length = 0;
          for (let i = 0; i < this.DIO.length; i++) {
            this.CCC.push(this.DIO[i] + this.DSO[i] - this.DPO[i]);
          }

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
                data: [...this.inventory].reverse(),
              },
              {
                name: 'Receivables',
                type: 'bar',
                data: [...this.receivables].reverse(),
              },
              {
                name: 'Cogs',
                type: 'bar',
                data: [...this.cogs].reverse(),
              },
              {
                name: 'Revenue',
                type: 'bar',
                data: [...this.revenue].reverse(),
              },
              {
                name: 'Accounts Payable',
                type: 'bar',
                data: [...this.accountsPayable].reverse(),
              },
            ],
          };

          this.lineChart = {
            title: {
              text: 'DIO vs DSO vs DPO',
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
                stack: 'Total',
                data: [...this.DIO].reverse(),
              },
              {
                name: 'DSO',
                type: 'line',
                stack: 'Total',
                data: [...this.DSO].reverse(),
              },
              {
                name: 'DPO',
                type: 'line',
                stack: 'Total',
                data: [...this.DPO].reverse(),
              },
            ],
          };
        });
    }
  }
}
