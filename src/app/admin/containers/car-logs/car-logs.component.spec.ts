import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarLogsComponent } from './car-logs.component';

describe('CarLogsComponent', () => {
  let component: CarLogsComponent;
  let fixture: ComponentFixture<CarLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarLogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
