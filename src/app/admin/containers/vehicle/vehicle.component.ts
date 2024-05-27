import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY_REQUEST, EMPTY_VEHICLE, PDFHelper } from 'src/app/core/helpers';
import { CommonModule } from '@angular/common';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { ICoordinate, MapsService } from 'src/app/core/services';
import { MarkerUrl, Report } from 'src/app/core/enums';
import moment from 'moment';
import { BaseChartDirective } from 'ng2-charts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { vehicleInfoHelper } from '../../helpers';
import { VehicleQueries } from '../../services';
import { IRequest, IVehicle, IVehicleInfo } from '../../interfaces';

const MAINTENANCE_COORDS = { lat: 14.09926541800526, lng: -87.15743413863002 };
const DEFAULT_COORDS = { lat: 14.089656466933825, lng: -87.1869442583274 };
const OPTIONS = {
  scales: {
    y: { beginAtZero: true}
  }
};
@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    CommonModule, LoadingComponent, PrimaryButtonComponent,
    BaseChartDirective, MatTooltipModule
  ],
  providers: [vehicleInfoHelper, PDFHelper],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnInit {
  public loading = true;
  public vehicleId = this.route.snapshot.params.id;
  public vehicle: IVehicle = EMPTY_VEHICLE;
  public map!: google.maps.Map;
  public initialMarker!: google.maps.marker.AdvancedMarkerElement;
  public finalMarker!: google.maps.marker.AdvancedMarkerElement;
  public directionRenderer!: google.maps.DirectionsRenderer;
  public lastMonth: IVehicleInfo = { kms: 0, gas: 0, cost: 0, kpg: 0, cpk: 0 };
  public currentMonth: IVehicleInfo = { kms: 0, gas: 0, cost: 0, kpg: 0, cpk: 0 };
  public maintenanceInfo: { date: Date, km: number} = { date: new Date(), km: 0 };
  public history: { months: string[]; kms: number[]; } = { months: [], kms: [] };
  public model = '';
  public maintenanceCoords: ICoordinate = MAINTENANCE_COORDS;
  public defaultCoords: ICoordinate = DEFAULT_COORDS;
  public request: IRequest = EMPTY_REQUEST;
  public date = '';
  public datasets: any[] = [];
  public options = OPTIONS;
  @ViewChild('map', { static: true }) public mapRef!: ElementRef;

  constructor(
    public vehicleHelper: vehicleInfoHelper,
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapsService,
    private vehicleQuery: VehicleQueries,
    private pdfHelper: PDFHelper
  ){}

  ngOnInit(): void {
    this.getVehicle();
    this.getGasAndMaintenanceInfo();
  }

  public goToLogs(): void {
    this.router.navigate([`/admin/log/${this.vehicleId}`]);
  }

  public goToRequests(): void {
    this.router.navigate([`/admin/requests/${this.vehicleId}`]);
  }

  public currentMonthBigger(prop: string): boolean {
    switch (prop) {
      case 'gas':
        return this.lastMonth.gas < this.currentMonth.gas;
      case 'cost':
        return this.lastMonth.cost < this.currentMonth.cost;
      case 'kpg':
        return this.lastMonth.kpg < this.currentMonth.kpg;
      case 'cpk':
        return this.lastMonth.cpk < this.currentMonth.cpk;
      case 'kms':
        return this.lastMonth.kms < this.currentMonth.kms;
    }
    return false;
  }

  public printReport(): void {
    this.pdfHelper.generateReport(Report.vehicle, this.vehicle, 'Reporte de Vehículo');
  }

  private getVehicle(): void {
    this.vehicleQuery.getVehicle(this.vehicleId).subscribe(({data}) => {
      this.vehicle = data;

      if (this.vehicle.Estado_Vehiculo.Estado_Vehiculo === 'En Uso') {
        this.request = this.vehicle.Solicitudes[0];
      }
      this.model = this.vehicleHelper.getModel(this.vehicle);
      this.initializeMap();
    });
  }

  private getGasAndMaintenanceInfo(): void {
    this.vehicleQuery.getVehicleInfo(this.vehicleId).subscribe((data) => {
      this.lastMonth = data.last;
      this.currentMonth = data.current;
      this.maintenanceInfo = data.maintenance;
      this.history = data.history;
      this.datasets = [{
        data: this.history.kms,
        label: 'kms recorridos'
      }];
      this.date = moment.utc(this.maintenanceInfo.date).format('DD/MM/YYYY');
    });
  }

  private initializeMap(): void {
    this.map = this.mapService.generateDefaultMap(this.mapRef);
    switch (this.vehicle.Estado_Vehiculo.Estado_Vehiculo) {
      case 'En Mantenimiento':
        this.initialMarker = this.mapService.addMarker(this.map, this.maintenanceCoords, MarkerUrl.warningCar);
        this.map.setCenter(this.maintenanceCoords);
        break;
      case 'Disponible':
        this.initialMarker = this.mapService.addMarker(this.map, this.defaultCoords, MarkerUrl.car);
        break;
      case 'Inactivo':
        this.initialMarker = this.mapService.addMarker(this.map, this.defaultCoords, MarkerUrl.warningCar);
        break;
      case 'En Uso':
        this.initialMarker = this.mapService.addMarker(this.map, JSON.parse(this.request.Ciudad.Coordenadas), MarkerUrl.car);
        this.map.setCenter(JSON.parse(this.request.Ciudad.Coordenadas));
        break;
      default:
        this.initialMarker = this.mapService.addMarker(this.map, this.defaultCoords, MarkerUrl.car);
        break;
    }
    this.loading = false;
  }
}
