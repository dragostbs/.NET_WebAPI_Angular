import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { LoadService } from '../loading/load.service';
import { AnalysisApiService } from '../services/analysis-api.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent implements OnInit {
  loadingElement: EChartsOption = {};

  constructor(
    public loadingService: LoadService,
    private charts: ChartsService,
    private service: AnalysisApiService
  ) {}

  ngOnInit(): void {
    this.loadingElement = this.charts.loadingElement();

    this.loadingService.setLoadingEffect(1000);
  }

  savePDF() {
    this.service.downloadPDF();
  }
}
