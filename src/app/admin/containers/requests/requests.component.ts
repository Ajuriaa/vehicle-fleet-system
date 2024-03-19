import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { PDFHelper } from 'src/app/core/helpers/pdf-generator.helper';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { vehicleInfoHelper } from '../../helpers';
import { RequestQueries } from '../../services';
import { SearchService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import { IDriver, IRequest, IVehicle } from '../../interfaces';
import moment from 'moment';
import 'moment-timezone';

const TABLE_COLUMNS = [
  'status', 'name', 'date', 'timeOut', 'timeIn', 'city', 'vehicle', 'driver', 'actions'
];

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, PrimaryButtonComponent, LoadingComponent],
  providers: [RequestQueries, PDFHelper, vehicleInfoHelper],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent {
  public loading = true;
  public searchInput = '';
  public displayedColumns: string[] = TABLE_COLUMNS;
  public requests: IRequest[] = [];
  public pendingRequests = 0;
  public activeRequests = 0;
  public filteredRequests: IRequest[] = [];

  constructor(
    private requestQuery: RequestQueries,
    private searchEngine: SearchService,
    private vehicleInfoHelper: vehicleInfoHelper,
    private dialog: MatDialog,
    private pdfHelper: PDFHelper,
  ) {}

  ngOnInit(): void {
    this.getAllRequests();
  }

  public onSearch(term: string): void {
    this.filteredRequests = this.searchEngine.filterData(this.requests, term, 'requests');
  }

  public generatePdf(): void {
    //this.pdfHelper.generateRequestsPdf(this.requests);
  }

  public getDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  public getTime(time: string): string {
    return moment(time).tz("America/Tegucigalpa").format('hh:mm');
  }

  public getVehicle(vehicle: IVehicle): string {
    if (!vehicle) return 'N/A';
    const model = this.vehicleInfoHelper.getModel(vehicle);
    const plate = vehicle.Placa;
    return `${model} - ${plate}`;
  }

  public getDriver(driver: IDriver): string {
    if (!driver) return 'N/A';
    return driver.Nombre;
  }

  public openDeleteRequestModal(request: any): void {
    // this.dialog.open(DeleteRequestComponent, {
    //   panelClass: 'dialog-style',
    //   data: {
    //     request,
    //     driverQuery: this.driverQuery
    //   }
    // });
  }

  private getAllRequests(): void {
    this.requestQuery.getAllRequests().subscribe(({data}) => {
      this.requests = data;
      this.pendingRequests = this.requests.filter(
        (request) => request.TB_Estado_Solicitud.Estado === 'Pendiente por admin'
      ).length;
      this.activeRequests = this.requests.filter(
        (request) => request.TB_Estado_Solicitud.Estado === 'Activo'
      ).length;
      this.filteredRequests = this.requests;
      this.loading = false;
    });
  }
}
