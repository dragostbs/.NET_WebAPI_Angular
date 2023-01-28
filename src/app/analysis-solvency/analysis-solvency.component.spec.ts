import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisSolvencyComponent } from './analysis-solvency.component';

describe('AnalysisSolvencyComponent', () => {
  let component: AnalysisSolvencyComponent;
  let fixture: ComponentFixture<AnalysisSolvencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisSolvencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisSolvencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
