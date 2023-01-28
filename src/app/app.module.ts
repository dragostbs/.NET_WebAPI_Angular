import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from './charts/chart.component';
import { DiscoverComponent } from './discover/discover.component';
import { ReportsComponent } from './reports/reports.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LoaderComponent } from './loader/loader.component';
import { CarouselComponent } from './discover/carousel/carousel.component';
import { GainerFallerComponent } from './discover/gainer-faller/gainer-faller.component';
import { NewsComponent } from './discover/news/news.component';
import { CrudApiService } from './services/crud-api.service';
import { TradeComponent } from './trade/trade.component';
import { LoginComponent } from './authenticate/login/login.component';
import { RegisterComponent } from './authenticate/register/register.component';
import { NavComponent } from './nav/nav.component';
import { AnalysisCCCComponent } from './analysis-ccc/analysis-ccc.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    DiscoverComponent,
    ReportsComponent,
    LoaderComponent,
    CarouselComponent,
    GainerFallerComponent,
    NewsComponent,
    TradeComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    AnalysisCCCComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [CrudApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
