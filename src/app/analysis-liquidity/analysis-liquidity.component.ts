import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';
import { AnalysisApiService } from '../services/analysis-api.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-analysis-liquidity',
  templateUrl: './analysis-liquidity.component.html',
  styleUrls: ['./analysis-liquidity.component.scss'],
})
export class AnalysisLiquidityComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  searchForm!: FormGroup;
  radialChart: EChartsOption = {};
  lineChart: EChartsOption = {};

  symbol: string = '';
  capitalization: number = 0;
  date: string[] = ['2022', '2021', '2020', '2019'];
  inventory: number[] = [0, 0, 0, 0];
  receivables: number[] = [0, 0, 0, 0];
  prePaidExpenses: number[] = [0, 0, 0, 0];
  cashOnHand: number[] = [0, 0, 0, 0];
  assets: number[] = [0, 0, 0, 0];
  liabillities: number[] = [0, 0, 0, 0];
  RLC: number[] = [0, 0, 0, 0];
  RLI: number[] = [0, 0, 0, 0];
  TR: number[] = [0, 0, 0, 0];
  RLE: number[] = [0, 0, 0, 0];

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
            timeSeries: { annualInventory },
          }: any = data;

          let {
            balanceSheetHistory: { balanceSheetStatements },
          }: any = data;

          let {
            timeSeries: { annualCurrentAssets },
          }: any = data;

          let {
            timeSeries: { annualCurrentLiabilities },
          }: any = data;

          // Reversing values
          annualInventory.reverse();
          annualCurrentAssets.reverse();
          annualCurrentLiabilities.reverse();

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

          this.receivables.length = 0;
          for (let value of balanceSheetStatements) {
            this.receivables.push(value.netReceivables.raw);
          }

          this.prePaidExpenses.length = 0;
          for (let value of balanceSheetStatements) {
            this.prePaidExpenses.push(value.deferredLongTermAssetCharges.raw);
          }

          this.cashOnHand.length = 0;
          for (let value of balanceSheetStatements) {
            this.cashOnHand.push(value.cash.raw);
          }

          this.assets.length = 0;
          for (let value of annualCurrentAssets) {
            this.assets.push(value.reportedValue.raw);
          }

          this.liabillities.length = 0;
          for (let value of annualCurrentLiabilities) {
            this.liabillities.push(value.reportedValue.raw);
          }

          // Results
          this.RLC.length = 0;
          for (let i = 0; i < this.assets.length; i++) {
            this.RLC.push((this.assets[i] / this.liabillities[i]) * 100);
          }

          this.RLI.length = 0;
          for (let i = 0; i < this.assets.length; i++) {
            this.RLI.push(
              ((this.assets[i] - this.inventory[i]) / this.liabillities[i]) *
                100
            );
          }

          this.TR.length = 0;
          for (let i = 0; i < this.prePaidExpenses.length; i++) {
            this.TR.push(this.prePaidExpenses[i] + this.cashOnHand[i]);
          }

          this.RLE.length = 0;
          for (let i = 0; i < this.liabillities.length; i++) {
            this.RLE.push((this.TR[i] / this.liabillities[i]) * 100);
          }

          this.lineChart = {
            title: {
              text: 'RLC vs RLI vs RLE',
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
              data: ['RLC', 'RLI', 'RLE'],
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
                name: 'RLC',
                type: 'line',
                stack: 'Total',
                data: [...this.RLC].reverse(),
              },
              {
                name: 'RLI',
                type: 'line',
                stack: 'Total',
                data: [...this.RLI].reverse(),
              },
              {
                name: 'RLE',
                type: 'line',
                stack: 'Total',
                data: [...this.RLE].reverse(),
              },
            ],
          };

          this.radialChart = {
            title: [
              {
                text: 'Assets vs Liabilities',
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
                data: [...this.assets].reverse(),
                coordinateSystem: 'polar',
                name: 'Assets',
              },
              {
                type: 'bar',
                data: [...this.liabillities].reverse(),
                coordinateSystem: 'polar',
                name: 'Liabilities',
              },
            ],
            legend: {
              show: true,
              top: 'bottom',
              data: ['Assets', 'Liabilities'],
            },
          };
        });
    }
  }
}
