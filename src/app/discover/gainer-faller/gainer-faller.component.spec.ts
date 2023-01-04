import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GainerFallerComponent } from './gainer-faller.component';

describe('GainerFallerComponent', () => {
  let component: GainerFallerComponent;
  let fixture: ComponentFixture<GainerFallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GainerFallerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GainerFallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
