import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisPositionComponent } from './analysis-position.component';

describe('AnalysisPositionComponent', () => {
  let component: AnalysisPositionComponent;
  let fixture: ComponentFixture<AnalysisPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisPositionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
