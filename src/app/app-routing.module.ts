import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisCCCComponent } from './analysis-ccc/analysis-ccc.component';
import { AnalysisLiquidityComponent } from './analysis-liquidity/analysis-liquidity.component';
import { AnalysisPerformanceComponent } from './analysis-performance/analysis-performance.component';
import { AnalysisPositionComponent } from './analysis-position/analysis-position.component';
import { AnalysisSolvencyComponent } from './analysis-solvency/analysis-solvency.component';
import { LoginComponent } from './authenticate/login/login.component';
import { RegisterComponent } from './authenticate/register/register.component';
import { ChartComponent } from './charts/chart.component';
import { DiscoverComponent } from './discover/discover.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login/register', component: RegisterComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'discover', component: DiscoverComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'analysisCash', component: AnalysisCCCComponent },
  { path: 'analysisLiquidity', component: AnalysisLiquidityComponent },
  { path: 'analysisSolvency', component: AnalysisSolvencyComponent },
  { path: 'analysisPerformance', component: AnalysisPerformanceComponent },
  { path: 'analysisPosition', component: AnalysisPositionComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
