import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisComponent } from './analysis/analysis.component';
import { ChartComponent } from './charts/chart.component';
import { DiscoverComponent } from './discover/discover.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/chart', pathMatch: 'full' },
  { path: 'chart', component: ChartComponent },
  { path: 'discover', component: DiscoverComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'analysis', component: AnalysisComponent },
  // { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
