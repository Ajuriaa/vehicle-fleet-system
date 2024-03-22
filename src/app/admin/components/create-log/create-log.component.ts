import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDriver, IVehicle } from '../../interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY_DRIVER, EMPTY_VEHICLE } from 'src/app/core/helpers';
import { PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { vehicleInfoHelper } from '../../helpers';
import { DriverQueries, VehicleQueries } from '../../services';
import { map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/core/services';
import { Model } from 'src/app/core/enums';

@Component({
  selector: 'app-create-log',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, FormsModule,
    ReactiveFormsModule, CommonModule, MatInputModule,
    MatAutocompleteModule, AsyncPipe, MatSelectModule,
    MatDatepickerModule
  ],
  providers: [vehicleInfoHelper, provideNativeDateAdapter()],
  templateUrl: './create-log.component.html',
  styleUrl: './create-log.component.scss'
})
export class CreateLogComponent implements OnInit {
  public logForm!: FormGroup;
  public logDataForm!: FormGroup;
  public vehicles: IVehicle[] = [];
  public filteredVehicles!: Observable<IVehicle[]>;
  public selectedVehicle: IVehicle = EMPTY_VEHICLE;
  public drivers: IDriver[] = [];
  public filteredDrivers!: Observable<IDriver[]>;
  public selectedDriver: IDriver = EMPTY_DRIVER;
  public readonly = false;

  constructor(
    public vehicleInfoHelper: vehicleInfoHelper,
    private _formBuilder: FormBuilder,
    private vehicleQuery: VehicleQueries,
    private driverQuery: DriverQueries,
    private dialogRef: MatDialogRef<CreateLogComponent>,
    private searchEngine: SearchService,
    @Inject(MAT_DIALOG_DATA) public vehicle: IVehicle = EMPTY_VEHICLE
  ){}

  ngOnInit(): void {
    this.logForm = this._formBuilder.group({
      vehicle: ['', [Validators.required]],
      driver: ['', [Validators.required]],
    });
    this.fetchData();
    this.startAutocomplete();
    this.fillForm();
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public selectVehicle(vehicle: IVehicle): void {
    this.selectedVehicle = vehicle;
  }

  public selectDriver(driver: IDriver): void {
    this.selectedDriver = driver;
  }

  public async onSubmit(): Promise<void> {
    if (this.logForm.invalid) {
      return;
    }
    this.onCancel(false);
    // const data = {
    //   ID_Conductor: this.data.driver.ID_Conductor,
    //   Nombre: this.driverForm.value.name
    // };

    //const mutationResponse = await this.driverMutation.createDriver(data);

    // if (mutationResponse) {
    //   this.onCancel(mutationResponse);
    // }
  }

  private fetchData(): void {
    this.driverQuery.getAllDrivers().subscribe(({ data }) => {
      if(data){
        this.drivers = data;
      }
    });
    this.vehicleQuery.getAllVehicles().subscribe(({ data }) => {
      if(data){
        this.vehicles = data;
      }
    });
  }

  private startAutocomplete(): void {
    this.filteredVehicles = this.logForm.controls.vehicle.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.vehicles, value, Model.vehicle)),
    );
    this.filteredDrivers = this.logForm.controls.driver.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.drivers, value, Model.driver)),
    );
  }

  private fillForm(): void {
    if(this.vehicle.ID_Vehiculo === 0) {
      return;
    }

    this.selectedVehicle = this.vehicle;
    this.logForm.patchValue({
      vehicle: this.vehicleInfoHelper.getModel(this.vehicle)
    });
    this.readonly = true;
  }
}
