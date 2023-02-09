import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BehaviorSubject } from 'rxjs';
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
