import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { EChartsOption } from 'echarts';
import { AnalysisApiService } from '../services/analysis-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-analysis-ccc',
  templateUrl: './analysis-ccc.component.html',
  styleUrls: ['./analysis-ccc.component.scss'],
})
export class AnalysisCCCComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  searchForm!: FormGroup;
  radarChart: EChartsOption = {};
  pieChart: EChartsOption = {};

  symbol: string = '';
  inventory: number = 0;
  cogs: number = 0;
  revenue: number = 0;
  receivables: number = 0;
  accountsPayable: number = 0;
  DIO: number = 0;
  DSO: number = 0;
  DPO: number = 0;
  CCC: number = 0;

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

          this.symbol = symbol;
          this.inventory = annualInventory[2].reportedValue.raw;
          this.cogs = incomeStatementHistory[1].costOfRevenue.raw;
          this.revenue = incomeStatementHistory[1].totalRevenue.raw;
          this.receivables = balanceSheetStatements[1].netReceivables.raw;
          this.accountsPayable = annualAccountsPayable[2].reportedValue.raw;

          // Results
          this.DIO =
            (annualInventory[2].reportedValue.raw /
              incomeStatementHistory[1].costOfRevenue.raw) *
            365;
          this.DSO =
            (balanceSheetStatements[1].netReceivables.raw /
              incomeStatementHistory[1].totalRevenue.raw) *
            365;
          this.DPO =
            (annualAccountsPayable[2].reportedValue.raw /
              incomeStatementHistory[1].costOfRevenue.raw) *
            365;
          this.CCC =
            (annualInventory[2].reportedValue.raw /
              incomeStatementHistory[1].costOfRevenue.raw) *
              365 +
            (balanceSheetStatements[1].netReceivables.raw /
              incomeStatementHistory[1].totalRevenue.raw) *
              365 -
            (annualAccountsPayable[2].reportedValue.raw /
              incomeStatementHistory[1].costOfRevenue.raw) *
              365;

          this.radarChart = {
            title: [
              {
                text: 'Data Visualisation',
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
              data: ['Values'],
            },
            radar: {
              indicator: [
                { name: 'Inventory' },
                { name: 'Receivables' },
                { name: 'Cost of Goods Sold' },
                { name: 'Revenue' },
                { name: 'Accounts Payable' },
              ],
            },
            series: [
              {
                name: 'Budget vs spending',
                type: 'radar',
                data: [
                  {
                    value: [
                      this.inventory,
                      this.receivables,
                      this.cogs,
                      this.revenue,
                      this.accountsPayable,
                    ],
                    name: 'Values',
                  },
                ],
              },
            ],
          };

          this.pieChart = {
            title: [
              {
                text: 'Analysis DIO, DSO, DPO',
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
                  { value: this.DIO, name: 'DIO' },
                  { value: this.DSO, name: 'DSO' },
                  { value: this.DPO, name: 'DPO' },
                ],
              },
            ],
          };
        });
    }
  }
}
