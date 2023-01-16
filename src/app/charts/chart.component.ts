import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { LoaderComponent } from '../loader/loader.component';
import { CandlesApiService } from '../services/candles-api.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  searchForm!: FormGroup;
  candlesChart: EChartsOption = {};

  constructor(
    private dataCandles: CandlesApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.displayChart();
    this.loaderComponent.loading = true;

    this.searchForm = this.fb.group({
      stockSymbol: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
    });

    // Display chart automatically on init
    let dates: string[] = [];
    let ticker: any[] = [];

    this.dataCandles.getCandlesDataInit().subscribe((data) => {
      for (let [key, value] of Object.entries(data)) {
        dates.push(key);
        ticker.push([value.Open, value.Close, value.Low, value.High]);
      }

      this.candlesChart = {
        xAxis: {
          data: dates,
          axisLine: { lineStyle: { color: '#8392A5' } },
        },
        yAxis: {
          scale: true,
          axisLine: { lineStyle: { color: '#8392A5' } },
        },
        series: [
          {
            type: 'candlestick',
            data: ticker,
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
        dataZoom: [
          {
            textStyle: {
              color: '#8392A5',
            },
            dataBackground: {
              areaStyle: {
                color: '#8392A5',
              },
              lineStyle: {
                opacity: 0.8,
                color: '#8392A5',
              },
            },
            brushSelect: true,
          },
          {
            type: 'inside',
          },
        ],
      };
      this.searchForm.reset({
        stockSymbol: '',
      });
    });
  }

  // Display chart based on search input
  displayChart() {
    let dates: string[] = [];
    let ticker: any[] = [];

    if (this.searchForm.valid) {
      this.dataCandles
        .getCandlesData(this.searchForm.value['stockSymbol'])
        .subscribe((data) => {
          if (Object.entries(data).length === 0)
            alert('🌋 The Stock could not be found !!!');

          for (let [key, value] of Object.entries(data)) {
            dates.push(key);
            ticker.push([value.Open, value.Close, value.Low, value.High]);
          }

          this.candlesChart = {
            xAxis: {
              data: dates,
              axisLine: { lineStyle: { color: '#8392A5' } },
            },
            yAxis: {
              scale: true,
              axisLine: { lineStyle: { color: '#8392A5' } },
            },
            series: [
              {
                type: 'candlestick',
                data: ticker,
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
            dataZoom: [
              {
                textStyle: {
                  color: '#8392A5',
                },
                dataBackground: {
                  areaStyle: {
                    color: '#8392A5',
                  },
                  lineStyle: {
                    opacity: 0.8,
                    color: '#8392A5',
                  },
                },
                brushSelect: true,
              },
              {
                type: 'inside',
              },
            ],
          };
          this.searchForm.reset({
            stockSymbol: '',
          });
        });
    }
  }
}
