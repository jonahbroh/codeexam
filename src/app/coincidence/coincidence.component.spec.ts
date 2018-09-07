import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoincidenceComponent } from './coincidence.component';

describe('CoincidenceComponent', () => {
  let component: CoincidenceComponent;
  let fixture: ComponentFixture<CoincidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoincidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoincidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
