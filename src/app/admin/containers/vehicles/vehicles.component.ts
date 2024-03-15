import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SearchService } from 'src/app/core/services';
import { PrimaryButtonComponent } from 'src/app/shared';
import { EMPTY_VEHICLE } from 'src/app/core/helpers';
import { CreateUpdateVehicleComponent, DeleteVehicleComponent } from '../../components';
import { VehicleQueries } from '../../services';
import { IVehicle } from '../../interfaces';

const TABLE_COLUMNS = [ 'plate', 'model', 'type','status', 'edit'];
@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, PrimaryButtonComponent],
  providers: [VehicleQueries],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})

export class VehiclesComponent implements OnInit {
  public searchInput = '';
  public availableVehicles = 0;
  public maintenance =  { id: 0, kms: 0 };
  public vehicles: IVehicle[] = [];
  public filteredVehicles: IVehicle[] = [];
  public maintenanceVehicle: IVehicle = EMPTY_VEHICLE;
  public displayedColumns: string[] = TABLE_COLUMNS;

  constructor(
    private vehicleQuery: VehicleQueries,
    private dialog: MatDialog,
    private searchEngine: SearchService
  ) {}

  ngOnInit(): void {
    this.getAllVehicles();
  }

  public onSearch(term: string): void {
    this.filteredVehicles = this.searchEngine.filterData(this.vehicles, term, 'vehicles');
  }

  public getModel(vehicle: IVehicle): string {
    const brand = vehicle.TB_Modelo.TB_Marca_Vehiculo.Marca;
    const model = vehicle.TB_Modelo.Modelo;
    const year = vehicle.Anio;
    return `${brand} ${model} ${year}`;
  }

  public getType(vehicle: IVehicle): string {
    return vehicle.TB_Modelo.TB_Tipo_Vehiculo.Tipo_Vehiculo;
  }

  public openDeleteVehicleModal(vehicle: IVehicle): void {
    this.dialog.open(DeleteVehicleComponent, {
      panelClass: 'dialog-style',
      data: {
        id: vehicle.ID_Vehiculo,
        plate: vehicle.Placa,
        model: this.getModel(vehicle)
      }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllVehicles();
      }
    });
  }

  public openCreateUpdateVehicleModal(modalType: string = 'create', vehicle: IVehicle = EMPTY_VEHICLE): void {
    this.dialog.open(CreateUpdateVehicleComponent, {
      panelClass: 'dialog-style',
      data: { vehicle, modalType }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllVehicles();
      }
    });
  }

  public getVehicleStatus(vehicle: IVehicle): string {
    return vehicle.TB_Estado_Vehiculo.Estado_Vehiculo;
  }

  private getMaintenanceInfo(maintenance: { id: number, kms: number }): void {
    this.maintenance = maintenance;
    this.maintenanceVehicle = this.vehicles.find(vehicle => vehicle.ID_Vehiculo === maintenance.id) || EMPTY_VEHICLE;
  }

  private getAllVehicles(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({data, maintenance}) => {
      if(data){
        this.vehicles = data;
        this.availableVehicles = this.vehicles.filter(vehicle => this.getVehicleStatus(vehicle) === 'Disponible').length;
        this.getMaintenanceInfo(maintenance);
        this.filteredVehicles = this.vehicles;
      }
    });
  }
}
