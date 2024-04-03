import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PrimaryButtonComponent } from 'src/app/shared';
import { ILog, IUser } from '../../interfaces';
import { map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/core/services';
import { Model } from 'src/app/core/enums';
import { CommonModule } from '@angular/common';
import { LogsQueries } from '../../services';
import { MatInputModule } from '@angular/material/input';
import { NameHelper } from '../../helpers';

@Component({
  selector: 'app-show-add-passengers',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, MatAutocompleteModule,
    FormsModule, MatCheckboxModule, CommonModule, ReactiveFormsModule,
    MatInputModule
  ],
  providers: [NameHelper],
  templateUrl: './show-add-passengers.component.html',
  styleUrl: './show-add-passengers.component.scss'
})
export class ShowAddPassengersComponent implements OnInit {
  public passengers: IUser[] = [];
  public filteredPassengers!: Observable<IUser[]>;
  public selectedPassengers: IUser[] = [];
  public passengerForm!: FormGroup;
  public error = false;
  public isCreate = false;
  public currentPassengers: IUser[] = [];

  constructor(
    private dialogRef: MatDialogRef<ShowAddPassengersComponent>,
    private _formBuilder: FormBuilder,
    private searchEngine: SearchService,
    private logQuery: LogsQueries,
    private nameHelper: NameHelper,
    @Inject(MAT_DIALOG_DATA) public data: { passengers: string, type: string }
  ){}

  ngOnInit(): void {
    this.isCreate = this.data.type === 'create';
    this.logQuery.getAllUsers().subscribe(({ data }) => {
      if (data) {
        this.passengers = data;
        if(!this.isCreate) {
          const passengerIds = JSON.parse(this.data.passengers);
          this.currentPassengers = this.passengers.filter(passenger => passengerIds.includes(passenger.ID_Empleado));
        }
      }
    });
    this.passengerForm = this._formBuilder.group({
      name: ['']
    });
    this.filteredPassengers = this.passengerForm.controls.name.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.passengers, value.toString(), Model.user)),
    );
  }

  public isPassengerSelected(user: IUser): boolean {
    return this.selectedPassengers.includes(user);
  }

  public toggleSelection(user: IUser): void {
    if (this.selectedPassengers.includes(user)) {
      const index = this.selectedPassengers.indexOf(user);
      this.selectedPassengers.splice(index, 1);
    } else {
      this.selectedPassengers.push(user);
    }
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(): void {
    if(this.selectedPassengers.length === 0) {
      this.error = true;
      return;
    }
    const passengerIds = this.selectedPassengers.map(passenger => passenger.ID_Empleado)
    this.dialogRef.close(JSON.stringify(passengerIds));
  }

  public display(): string {
    const names = this.selectedPassengers.map((passenger) => {
      return this.nameHelper.getShortName(passenger.Nombres + " " + passenger.Apellidos)
    })
    return names.join(', ');
  }

  public clearInput(): void {
    const nameControl = this.passengerForm.get('name');
    if (nameControl) {
      nameControl.setValue('');
    }
  }
}
