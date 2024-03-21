import { Component } from '@angular/core';
import { SearchService } from 'src/app/core/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent, LoadingComponent, NoResultComponent, LogCardComponent } from 'src/app/shared';
import { IVehicle } from '../../interfaces';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule, PrimaryButtonComponent, FormsModule,
    LoadingComponent, NoResultComponent, LogCardComponent
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  public loading = false;
  public searchInput = '';
  public vehicles: IVehicle[] = [];
  public filteredVehicles: IVehicle[] = [];

  constructor(
    private searchEngine: SearchService
  ){}

  public onSearch(term: string): void {
    this.filteredVehicles = this.searchEngine.filterData(this.vehicles, term, 'vehicles');
  }
}
