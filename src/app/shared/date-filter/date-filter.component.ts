import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [MatDatepickerModule, MatFormFieldModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss'
})
export class DateFilterComponent implements OnInit {
  @Output() dateRangeChanged = new EventEmitter<{ startDate: Date | null, endDate: Date | null }>();
  public dateForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.dateForm = this._formBuilder.group({
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
    });
    this.dateForm.valueChanges.subscribe(value => {
      this.dateRangeChanged.emit({ startDate: value.startDate, endDate: value.endDate });
    });
  }
}
