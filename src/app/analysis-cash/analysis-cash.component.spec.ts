import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisCCCComponent } from './analysis-cash.component';

describe('AnalysisCCCComponent', () => {
  let component: AnalysisCCCComponent;
  let fixture: ComponentFixture<AnalysisCCCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalysisCCCComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisCCCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
