import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/core/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent, LoadingComponent, NoResultComponent, VehicleCardComponent } from 'src/app/shared';
import { IVehicle } from '../../interfaces';
import { VehicleQueries } from '../../services';
import moment from 'moment';
import { CreateLogComponent } from '../../components';
import { MatDialog } from '@angular/material/dialog';
import { Model } from 'src/app/core/enums';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule, PrimaryButtonComponent, FormsModule,
    LoadingComponent, NoResultComponent, VehicleCardComponent
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public vehicles: IVehicle[] = [];
  public kms = 0;
  public vehiclesCount = 0;
  public filteredVehicles: IVehicle[] = [];

  constructor(
    private searchEngine: SearchService,
    private vehicleQuery: VehicleQueries,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.getAllVehicles();
  }

  public openCreateLogModal(): void {
    this.dialog.open(CreateLogComponent, {
      maxWidth: '100%',
      panelClass: 'dialog-style'
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllVehicles();
      }
    });
  }

  public countData(): void {
    const startOfWeek = moment.utc().clone().startOf('week').subtract(1, 'days');
    const endOfWeek = moment.utc().clone().endOf('week').subtract(1, 'days');
    const vehiclesWithLogs = this.vehicles.filter(vehicle => vehicle.Bitacoras.length > 0);
    this.vehiclesCount = vehiclesWithLogs.filter(vehicle => {
      const bitacoraDate = moment.utc(vehicle.Bitacoras[0].Fecha);
      return bitacoraDate.isBetween(startOfWeek, endOfWeek);
    }).length;
    let totalKms = 0;
    vehiclesWithLogs.forEach(vehicle => {
      vehicle.Bitacoras.forEach(bitacora => {
          const bitacoraDate = moment.utc(bitacora.Fecha);
          if (bitacoraDate.isBetween(startOfWeek, endOfWeek)) {
              totalKms += (bitacora.Kilometraje_Entrada - bitacora.Kilometraje_Salida);
          }
      });
    });
    this.kms = totalKms;
  }

  public onSearch(term: string): void {
    this.filteredVehicles = this.searchEngine.filterData(this.vehicles, term, Model.vehicle);
  }

  private getAllVehicles(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({data}) => {
      if(data){
        this.vehicles = data;
        this.filteredVehicles = this.vehicles;
        this.countData();
        this.loading = false;
      }
    });
  }
}