import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPassengersComponent } from './add-passengers.component';

describe('AddPassengersComponent', () => {
  let component: AddPassengersComponent;
  let fixture: ComponentFixture<AddPassengersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPassengersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
