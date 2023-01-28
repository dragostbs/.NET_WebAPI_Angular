import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-analysis-performance',
  templateUrl: './analysis-performance.component.html',
  styleUrls: ['./analysis-performance.component.scss'],
})
export class AnalysisPerformanceComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  ngOnInit(): void {
    this.loaderComponent.loading = true;
  }
}
