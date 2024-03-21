import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingComponent, MaintenanceCardComponent, PrimaryButtonComponent, NoResultComponent } from 'src/app/shared';
import { IMaintenance, IVehicle } from '../../interfaces';
import { SearchService } from 'src/app/core/services';
import { VehicleQueries } from '../../services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateMaintenanceComponent } from '../../components';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [
    MaintenanceCardComponent, LoadingComponent,
    CommonModule, FormsModule, PrimaryButtonComponent,
    NoResultComponent
  ],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss'
})
export class MaintenanceComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public vehicles: IVehicle[] = [];
  public filteredVehicles: IVehicle[] = [];
  public lastMonthMaintenanceVehicles = 0;

  constructor(
    private searchEngine: SearchService,
    private vehicleQuery: VehicleQueries,
    private router: Router,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.getAllVehicles();
  }

  public onSearch(term: string): void {
    this.filteredVehicles = this.searchEngine.filterData(this.vehicles, term, 'vehicles');
  }

  public goToVehicle(vehicleId: number): void {
    this.router.navigate([`/admin/vehicle/${vehicleId}`]);
  }

  private getAllVehicles(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({data}) => {
      if(data){
        this.vehicles = data;
        this.filteredVehicles = this.vehicles;
        this.loading = false;
        this.getVehiclesMaintenancesLastMonth();
      }
    });
  }

  public openCreateMaintenanceModal(): void {
    this.dialog.open(CreateMaintenanceComponent, {
      panelClass: 'dialog-style'
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllVehicles();
      }
    });
  }

  private getVehiclesMaintenancesLastMonth(): void {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.lastMonthMaintenanceVehicles =  this.vehicles.filter(vehicle =>
      vehicle?.Mantenimientos?.some(mantenimiento => {
        const mantenimientoDate = new Date(mantenimiento.Fecha);
        return mantenimientoDate >= firstDayOfMonth && mantenimientoDate <= lastDayOfMonth;
      })
    ).length;
  }
}
