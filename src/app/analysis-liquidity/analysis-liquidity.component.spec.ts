import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisLiquidityComponent } from './analysis-liquidity.component';

describe('AnalysisLiquidityComponent', () => {
  let component: AnalysisLiquidityComponent;
  let fixture: ComponentFixture<AnalysisLiquidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisLiquidityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisLiquidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
