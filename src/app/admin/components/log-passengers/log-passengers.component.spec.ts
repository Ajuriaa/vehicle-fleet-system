import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogPassengersComponent } from './log-passengers.component';

describe('LogPassengersComponent', () => {
  let component: LogPassengersComponent;
  let fixture: ComponentFixture<LogPassengersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogPassengersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogPassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
