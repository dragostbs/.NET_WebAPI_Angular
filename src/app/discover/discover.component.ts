import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { LoadService } from '../loading/load.service';
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
    private charts: ChartsService
  ) {}

  ngOnInit(): void {
    this.loadingElement = this.charts.loadingElement();

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
