import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DiscoverComponent } from './discover/discover.component';
import { ReportsComponent } from './reports/reports.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CarouselComponent } from './discover/carousel/carousel.component';
import { GainerFallerComponent } from './discover/gainer-faller/gainer-faller.component';
import { NewsComponent } from './discover/news/news.component';
import { CrudApiService } from './services/crud-api.service';
import { TradeComponent } from './trade/trade.component';
import { LoginComponent } from './authenticate/login/login.component';
import { RegisterComponent } from './authenticate/register/register.component';
import { NavComponent } from './nav/nav.component';
import { AnalysisCashComponent } from './analysis-cash/analysis-cash.component';
import { AnalysisLiquidityComponent } from './analysis-liquidity/analysis-liquidity.component';
import { AnalysisSolvencyComponent } from './analysis-solvency/analysis-solvency.component';
import { AnalysisPerformanceComponent } from './analysis-performance/analysis-performance.component';
import { AnalysisPositionComponent } from './analysis-position/analysis-position.component';
import { InterceptorService } from './loading/interceptor.service';
import { HomeComponent } from './home/home.component';
import { AnalysisRiskComponent } from './analysis-risk/analysis-risk.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent,
    ReportsComponent,
    CarouselComponent,
    GainerFallerComponent,
    NewsComponent,
    TradeComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    AnalysisCashComponent,
    AnalysisLiquidityComponent,
    AnalysisSolvencyComponent,
    AnalysisPerformanceComponent,
    AnalysisPositionComponent,
    HomeComponent,
    AnalysisRiskComponent,
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
    MatProgressBarModule,
  ],
  providers: [
    CrudApiService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
