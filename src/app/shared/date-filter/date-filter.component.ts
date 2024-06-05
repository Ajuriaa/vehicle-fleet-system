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
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.dateForm = this._formBuilder.group({
      startDate: new FormControl<Date | null>(firstDay),
      endDate: new FormControl<Date | null>(today),
    });
    this.dateForm.valueChanges.subscribe(value => {
      this.dateRangeChanged.emit({ startDate: value.startDate, endDate: value.endDate });
    });
  }
}
