import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PrimaryButtonComponent } from 'src/app/shared';
import { IUser } from '../../interfaces';
import { map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/core/services';
import { Model } from 'src/app/core/enums';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-passengers',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, MatAutocompleteModule,
    FormsModule, MatCheckboxModule, CommonModule, ReactiveFormsModule
  ],
  templateUrl: './add-passengers.component.html',
  styleUrl: './add-passengers.component.scss'
})
export class AddPassengersComponent implements OnInit {
  public passengers: IUser[] = [];
  public filteredPassengers!: Observable<IUser[]>;
  public selectedPassengers: IUser[] = [];
  public passengerForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddPassengersComponent>,
    private _formBuilder: FormBuilder,
    private searchEngine: SearchService
  ){}

  ngOnInit(): void {
    this.passengerForm = this._formBuilder.group({
      name: ['', [Validators.required]]
    });
    this.filteredPassengers = this.passengerForm.controls.name.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.passengers, value, Model.vehicle)),
    );
  }

  public optionClicked(event: Event, user: IUser): void {
    event.stopPropagation();
    //this.toggleSelection(user);
  }

  public isPassengerSelected(user: IUser): boolean {
    return true;
  }

  public toggleSelection(user: IUser): void {
    true;
  }

  public onCancel(): void {
    this.dialogRef.close(true);
  }

  public onSubmit(): void {
    this.dialogRef.close(true);
  }
}
