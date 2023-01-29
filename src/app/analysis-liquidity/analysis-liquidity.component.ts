import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';
import { AnalysisApiService } from '../services/analysis-api.service';

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
  pieChart: EChartsOption = {};

  symbol: string = '';
  inventory: number = 0;
  receivables: number = 0;
  prePaidExpenses: number = 0;
  cashOnHand: number = 0;
  assets: number = 0;
  liabilities: number = 0;
  RLC: number = 0;
  RLI: number = 0;
  TR: number = 0;
  RLE: number = 0;

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
            balanceSheetHistory: { balanceSheetStatements },
          }: any = data;

          let {
            timeSeries: { annualCurrentAssets },
          }: any = data;

          let {
            timeSeries: { annualCurrentLiabilities },
          }: any = data;

          this.symbol = symbol;
          this.inventory = annualInventory[2].reportedValue.raw;
          this.receivables = balanceSheetStatements[1].netReceivables.raw;
          this.prePaidExpenses =
            balanceSheetStatements[1].deferredLongTermAssetCharges.raw;
          this.cashOnHand = balanceSheetStatements[1].cash.raw;
          this.assets = annualCurrentAssets[2].reportedValue.raw;
          this.liabilities = annualCurrentLiabilities[2].reportedValue.raw;

          // Results
          this.RLC = (this.assets / this.liabilities) * 100;
          this.RLI = ((this.assets - this.inventory) / this.liabilities) * 100;
          this.TR = this.prePaidExpenses + this.cashOnHand;
          this.RLE = (this.TR / this.liabilities) * 100;

          this.pieChart = {
            title: [
              {
                text: 'Analysis RLC, RLI, RLE',
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
                  { value: this.RLC, name: 'RLC' },
                  { value: this.RLI, name: 'RLI' },
                  { value: this.RLE, name: 'RLE' },
                ],
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
                data: [this.assets],
                coordinateSystem: 'polar',
                name: 'Assets',
              },
              {
                type: 'bar',
                data: [this.liabilities],
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
