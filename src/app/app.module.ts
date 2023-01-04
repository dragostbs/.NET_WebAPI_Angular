import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from './charts/chart.component';
import { DiscoverComponent } from './discover/discover.component';
import { ReportsComponent } from './reports/reports.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LoaderComponent } from './loader/loader.component';
import { CarouselComponent } from './discover/carousel/carousel.component';
import { GainerFallerComponent } from './discover/gainer-faller/gainer-faller.component';
import { NewsComponent } from './discover/news/news.component';
import { CardsComponent } from './analysis/cards/cards.component';
import { PieBarComponent } from './analysis/pie-bar/pie-bar.component';
import { TablesComponent } from './analysis/tables/tables.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    DiscoverComponent,
    ReportsComponent,
    AnalysisComponent,
    LoaderComponent,
    CarouselComponent,
    GainerFallerComponent,
    NewsComponent,
    CardsComponent,
    PieBarComponent,
    TablesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
