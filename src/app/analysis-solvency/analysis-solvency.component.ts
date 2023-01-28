import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-analysis-solvency',
  templateUrl: './analysis-solvency.component.html',
  styleUrls: ['./analysis-solvency.component.scss'],
})
export class AnalysisSolvencyComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  ngOnInit(): void {
    this.loaderComponent.loading = true;
  }
}
