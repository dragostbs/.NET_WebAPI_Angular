import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisRiskComponent } from './analysis-risk.component';

describe('AnalysisRiskComponent', () => {
  let component: AnalysisRiskComponent;
  let fixture: ComponentFixture<AnalysisRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
