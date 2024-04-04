import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY_DRIVER, EMPTY_VEHICLE } from 'src/app/core/helpers';
import { PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule, AsyncPipe, Location } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/core/services';
import { Model } from 'src/app/core/enums';
import { MatTable, MatTableModule } from '@angular/material/table';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DriverQueries, VehicleQueries } from '../../services';
import { vehicleInfoHelper } from '../../helpers';
import { IDriver, ILog, IVehicle } from '../../interfaces';
import { AddLogComponent, GasInfoComponent, ShowAddPassengersComponent } from '../../components';

const TABLE_COLUMNS = [
  'date'  ,'destination', 'timeOut', 'timeIn', 'kmsOut', 'kmsIn', 'gas', 'passengers', 'observation','delete'
];
@Component({
  selector: 'app-create-log',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, FormsModule,
    ReactiveFormsModule, CommonModule, MatInputModule,
    MatAutocompleteModule, AsyncPipe, MatSelectModule,
    MatTableModule
  ],
  providers: [vehicleInfoHelper, provideNativeDateAdapter()],
  templateUrl: './create-log.component.html',
  styleUrl: './create-log.component.scss'
})
export class CreateLogComponent implements OnInit {
  public logForm!: FormGroup;
  public vehicles: IVehicle[] = [];
  public filteredVehicles!: Observable<IVehicle[]>;
  public selectedVehicle: IVehicle = EMPTY_VEHICLE;
  public drivers: IDriver[] = [];
  public logs: ILog[] = [];
  public filteredDrivers!: Observable<IDriver[]>;
  public selectedDriver: IDriver = EMPTY_DRIVER;
  public displayedColumns: string[] = TABLE_COLUMNS;
  public readonly = false;
  public showTable = false;
  public error = false;
  public currentKm = 0;
  public currentTime = new Date().toLocaleTimeString();
  public vehicle: IVehicle = EMPTY_VEHICLE;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    public vehicleInfoHelper: vehicleInfoHelper,
    private _formBuilder: FormBuilder,
    private vehicleQuery: VehicleQueries,
    private driverQuery: DriverQueries,
    private searchEngine: SearchService,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.logForm = this._formBuilder.group({
      vehicle: ['', [Validators.required]],
      driver: ['', [Validators.required]],
    });
    this.fetchData();
    this.startAutocomplete();
  }

  public selectVehicle(vehicle: IVehicle): void {
    this.selectedVehicle = vehicle;
    this.currentKm = vehicle.Kilometraje;
  }

  public openPassengerModal(log: ILog, modalType = 'create'): void {
    this.dialog.open(ShowAddPassengersComponent, {
      panelClass: 'dialog-style',
      data: { passengers: log.Pasajeros, modalType: modalType }
    }).afterClosed().subscribe((result) => {
      if(result) {
        log.Pasajeros = result;
      }
    });
  }

  public selectDriver(driver: IDriver): void {
    this.selectedDriver = driver;
  }

  public formatDate(date: string): string {
    return moment.utc(date).format('DD/MM/YYYY');
  }

  public formatTime(time: string): string {
    return moment.utc(time, 'HH:mm:ss').format('hh:mm A');
  }

  public hasGasRefill(log: ILog): boolean {
    return log.Llenados_Combustible.length > 0 ? true : false;
  }

  public hasPassengers(log: ILog): boolean {
    return log.Pasajeros.length > 0 ? true : false;
  }

  public return(): void {
    this.location.back();
  }

  public showLogTable(): void {
    if(this.logForm.invalid) {
      this.error = true;
      return;
    }

    this.showTable = true;
    this.error = false;
  }

  public openLogModal(): void {
    this.dialog.open(AddLogComponent, {
      maxWidth: '100%',
      panelClass: 'dialog-style',
      data: {
        lastKms: this.currentKm,
        lastTime: moment(this.currentTime, 'hh:mm:ss A').format('hh:mm A')
      }
    }).afterClosed().subscribe((log) => {
      if(!log) {
        return;
      }
      const formattedLog = log as ILog;
      formattedLog.Llenados_Combustible = [];
      formattedLog.Pasajeros = '';
      formattedLog.Conductor = this.selectedDriver;
      formattedLog.Vehiculo = this.selectedVehicle;
      this.logs.push(formattedLog);
      this.currentTime = formattedLog.Hora_Entrada.toString();
      this.currentKm = formattedLog.Kilometraje_Entrada;
      this.table.renderRows();
    });
  }

  public removeLog(removedLog: ILog): void {
    this.logs = this.logs.filter(log => log !== removedLog);
    const lastLog = this.logs[this.logs.length - 1];

    if(this.logs.length > 0) {
      this.currentTime = lastLog.Hora_Entrada.toString();
      this.currentKm = lastLog.Kilometraje_Entrada;
    }
    this.table.renderRows();
  }

  public openGasInfo(log: ILog): void {
    this.dialog.open(GasInfoComponent, {
      panelClass: 'dialog-style',
      data: log
    });
  }

  private fetchData(): void {
    const vehicleId = +this.route.snapshot.params.id;
    if(vehicleId !== 0) {
      this.vehicleQuery.getVehicle(vehicleId).subscribe(({ data }) => {
        if(data){
          this.vehicle = data;
          this.currentKm = this.vehicle.Kilometraje;
          this.fillForm();
        }
      });
    }
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
    this.selectedVehicle = this.vehicle;
    this.logForm.patchValue({
      vehicle: this.vehicleInfoHelper.getModel(this.vehicle)
    });
    this.readonly = true;
  }
}
