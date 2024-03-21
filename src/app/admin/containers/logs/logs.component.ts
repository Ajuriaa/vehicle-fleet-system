import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/core/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent, LoadingComponent, NoResultComponent, VehicleCardComponent } from 'src/app/shared';
import { IVehicle } from '../../interfaces';
import { VehicleQueries } from '../../services';

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
  public filteredVehicles: IVehicle[] = [];

  constructor(
    private searchEngine: SearchService,
    private vehicleQuery: VehicleQueries
  ){}

  ngOnInit(): void {
    this.getAllVehicles();
  }

  public onSearch(term: string): void {
    this.filteredVehicles = this.searchEngine.filterData(this.vehicles, term, 'vehicles');
  }

  private getAllVehicles(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({data}) => {
      if(data){
        this.vehicles = data;
        this.filteredVehicles = this.vehicles;
        this.loading = false;
      }
    });
  }
}
