import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisPerformanceComponent } from './analysis-performance.component';

describe('AnalysisPerformanceComponent', () => {
  let component: AnalysisPerformanceComponent;
  let fixture: ComponentFixture<AnalysisPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisPerformanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
