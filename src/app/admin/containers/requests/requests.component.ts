import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { SearchService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import 'moment-timezone';
import { ActivatedRoute, Router } from '@angular/router';
import { PDFHelper } from 'src/app/core/helpers';
import { Model, RequestStatus } from 'src/app/core/enums';
import { NgxPaginationModule } from 'ngx-pagination';
import { IDriver, IRequest, IRequestStatus, IVehicle } from '../../interfaces';
import { RequestQueries } from '../../services';
import { NameHelper, vehicleInfoHelper } from '../../helpers';
import { ConfirmComponentComponent, UpdateRequestComponent } from '../../components';

const TABLE_COLUMNS = [
  'status', 'name', 'date', 'timeOut', 'timeIn', 'city', 'vehicle', 'driver', 'actions'
];

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, FormsModule,
    PrimaryButtonComponent, LoadingComponent, NgxPaginationModule
  ],
  providers: [RequestQueries, PDFHelper, vehicleInfoHelper, NameHelper],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent implements OnInit {
  public vehicleId = +this.route.snapshot.params.id;
  public loading = true;
  public searchInput = '';
  public displayedColumns: string[] = TABLE_COLUMNS;
  public requests: IRequest[] = [];
  public pendingRequests = 0;
  public activeRequests = 0;
  public filteredRequests: IRequest[] = [];
  public requestStatuses: IRequestStatus[] = [];
  public page = 1;

  constructor(
    public nameHelper: NameHelper,
    private requestQuery: RequestQueries,
    private searchEngine: SearchService,
    private vehicleInfoHelper: vehicleInfoHelper,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private pdfHelper: PDFHelper
  ) {}

  ngOnInit(): void {
    this.getRequestStatus();
    this.getAllRequests();
  }

  public onSearch(term: string): void {
    this.filteredRequests = this.searchEngine.filterData(this.requests, term, Model.request);
  }

  public generatePdf(): void {
    this.pdfHelper.generateRequestsPdf(this.filteredRequests);
  }

  public getDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  public getTime(time: string): string {
    return moment(time).tz("America/Tegucigalpa").format('hh:mm');
  }

  public canEdit(request: IRequest): boolean {
    const status = request.Estado_Solicitud.Estado;
    if (status === RequestStatus.pendingByAdmin || status === RequestStatus.active) return true;
    return false;
  }

  public canFinish(request: IRequest): boolean {
    return request.Estado_Solicitud.Estado === RequestStatus.active;
  }

  public canCancel(request: IRequest): boolean {
    return request.Estado_Solicitud.Estado === RequestStatus.pendingByAdmin ;
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

  public openRequest(requestId: number): void {
    this.router.navigate([`/admin/request/${requestId}`]);
  }

  public openDriver(driver: IDriver): void {
    if (!driver) return;
    this.router.navigate([`/admin/driver/${driver.ID_Conductor}`]);
  }

  public openVehicle(vehicle: IVehicle): void {
    if (!vehicle) return;
    this.router.navigate([`/admin/vehicle/${vehicle.ID_Vehiculo}`]);
  }

  public openUpdateRequestModal(request: IRequest): void {
    this.dialog.open(UpdateRequestComponent, {
      panelClass: 'dialog-style',
      data: request
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllRequests();
      }
    });
  }

  public openRequestModal(request: IRequest, type: string = 'cancel-request'): void {
    this.dialog.open(ConfirmComponentComponent, {
      panelClass: 'dialog-style',
      data: { type, id: request.ID_Solicitud }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllRequests();
      }
    });
  }

  private getRequestStatus(): void {
    this.requestQuery.getRequestStatuses().subscribe(({data}) => {
      this.requestStatuses = data;
    });
  }

  private getAllRequests(): void {
    if(this.vehicleId === 0) {
      this.requestQuery.getAllRequests().subscribe(({data}) => {
        this.requests = data;
        this.pendingRequests = this.requests.filter(
          (request) => request.Estado_Solicitud.Estado === 'Pendiente por admin'
        ).length;
        this.activeRequests = this.requests.filter(
          (request) => request.Estado_Solicitud.Estado === 'Activo'
        ).length;
        this.filteredRequests = this.requests;
        this.loading = false;
      });
    } else {
      this.requestQuery.getVehicleRequests(this.vehicleId).subscribe(({data}) => {
        this.requests = data;
        this.pendingRequests = this.requests.filter(
          (request) => request.Estado_Solicitud.Estado === 'Pendiente por admin'
        ).length;
        this.activeRequests = this.requests.filter(
          (request) => request.Estado_Solicitud.Estado === 'Activo'
        ).length;
        this.filteredRequests = this.requests;
        this.loading = false;
      });
    }
  }
}
