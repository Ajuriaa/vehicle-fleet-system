import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DeleteVehicleComponent } from '../../components';
import { VehicleQueries } from '../../services';
import { IVehicle } from '../../interfaces';
import { SearchService } from 'src/app/core/services';

const TABLE_COLUMNS = [ 'plate', 'model', 'type','status', 'edit'];
@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule],
  providers: [VehicleQueries],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})

export class VehiclesComponent implements OnInit {
  public vehicles: IVehicle[] = [];
  public filteredVehicles: IVehicle[] = [];
  public searchInput = '';
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

  private getAllVehicles(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({data}) => {
      if(data){
        this.vehicles = data;
        this.filteredVehicles = this.vehicles;
      }
    });
  }
}
