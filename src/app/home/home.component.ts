import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { LoadService } from '../loading/load.service';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loadingElement: EChartsOption = {};

  constructor(
    public loadingService: LoadService,
    private charts: ChartsService
  ) {}

  ngOnInit(): void {
    this.loadingElement = this.charts.loadingElement();
    this.loadingEffect();
  }

  loadingEffect() {
    this.loadingService.setLoadingEffect(1000);
  }
}
