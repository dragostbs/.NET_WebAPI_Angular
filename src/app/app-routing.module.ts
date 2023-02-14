import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisCashComponent } from './analysis-cash/analysis-cash.component';
import { AnalysisLiquidityComponent } from './analysis-liquidity/analysis-liquidity.component';
import { AnalysisPerformanceComponent } from './analysis-performance/analysis-performance.component';
import { AnalysisPositionComponent } from './analysis-position/analysis-position.component';
import { AnalysisRiskComponent } from './analysis-risk/analysis-risk.component';
import { AnalysisSolvencyComponent } from './analysis-solvency/analysis-solvency.component';
import { LoginComponent } from './authenticate/login/login.component';
import { RegisterComponent } from './authenticate/register/register.component';
import { DiscoverComponent } from './discover/discover.component';
import { HomeComponent } from './home/home.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login/register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'discover', component: DiscoverComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'analysisCash', component: AnalysisCashComponent },
  { path: 'analysisLiquidity', component: AnalysisLiquidityComponent },
  { path: 'analysisSolvency', component: AnalysisSolvencyComponent },
  { path: 'analysisPerformance', component: AnalysisPerformanceComponent },
  { path: 'analysisPosition', component: AnalysisPositionComponent },
  { path: 'analysisRisk', component: AnalysisRiskComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
