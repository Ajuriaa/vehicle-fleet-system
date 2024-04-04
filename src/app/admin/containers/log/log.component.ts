import { Component, OnInit } from '@angular/core';
import { EMPTY_VEHICLE } from 'src/app/core/helpers';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from 'src/app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent, NoResultComponent, PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import moment from 'moment';
import { Model } from 'src/app/core/enums';
import { GasInfoComponent, ShowAddPassengersComponent } from '../../components';
import { vehicleInfoHelper } from '../../helpers';
import { VehicleQueries } from '../../services';
import { ILog, IVehicle } from '../../interfaces';

const TABLE_COLUMNS = [
  'date', 'driver', 'destination', 'kmsOut', 'kmsIn', 'timeOut', 'timeIn', 'observation', 'passengers', 'gas'
];
@Component({
  selector: 'app-log',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, FormsModule,
    PrimaryButtonComponent, LoadingComponent, NoResultComponent
  ],
  providers: [vehicleInfoHelper],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss'
})
export class LogComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public displayedColumns: string[] = TABLE_COLUMNS;
  public logs: ILog[] = [];
  public filteredLogs: ILog[] = [];
  public vehicle: IVehicle = EMPTY_VEHICLE;

  constructor(
    public vehicleHelper: vehicleInfoHelper,
    private searchEngine: SearchService,
    private vehicleQuery: VehicleQueries,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.getVehicle();
  }

  public onSearch(term: string): void {
    this.filteredLogs = this.searchEngine.filterData(this.logs, term, Model.log);
  }

  public createLog(): void {
    this.router.navigate([`/admin/create-log/`, this.vehicle.ID_Vehiculo]);
  }

  public openPassengerList(log: ILog): void {
    this.dialog.open(ShowAddPassengersComponent, {
      panelClass: 'dialog-style',
      data: {
        passengers: log.Pasajeros,
        modalType: 'show'
      }
    });
  }

  public openGasInfo(log: ILog): void {
    this.dialog.open(GasInfoComponent, {
      panelClass: 'dialog-style',
      data: {
        log: log,
        modalType: 'show'
      }
    });
  }

  public formatDate(date: string): string {
    return moment.utc(date).format('DD/MM/YYYY');
  }

  public formatTime(time: string): string {
    return moment.utc(time).format('hh:mm A');
  }

  public hasGasRefill(log: ILog): boolean {
    return log.Llenados_Combustible.length > 0;
  }

  private getVehicle(): void {
    const vehicleId = this.route.snapshot.params.id;

    this.vehicleQuery.getVehicle(vehicleId).subscribe(({data}) => {
      this.vehicle = data;
      this.logs = this.vehicle.Bitacoras;
      this.filteredLogs = this.logs;
      this.loading = false;
    });
  }
}
