import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasFillComponent } from './gas-fill.component';

describe('GasFillComponent', () => {
  let component: GasFillComponent;
  let fixture: ComponentFixture<GasFillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasFillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GasFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
