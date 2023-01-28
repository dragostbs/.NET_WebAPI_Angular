import { Component, OnInit, ViewChild } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-analysis-position',
  templateUrl: './analysis-position.component.html',
  styleUrls: ['./analysis-position.component.scss'],
})
export class AnalysisPositionComponent implements OnInit {
  @ViewChild(LoaderComponent, { static: true })
  loaderComponent!: LoaderComponent;

  ngOnInit(): void {
    this.loaderComponent.loading = true;
  }
}
