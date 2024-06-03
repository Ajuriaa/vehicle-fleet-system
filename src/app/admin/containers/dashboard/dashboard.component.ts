import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { LoadingComponent, NoResultComponent, SideBarComponent } from 'src/app/shared';
import { EMPTY_VEHICLE, PDFHelper } from 'src/app/core/helpers';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { vehicleInfoHelper } from '../../helpers';
import { IVehicle, monthData } from '../../interfaces';
import { DashboardQueries } from '../../services';

const PIE_OPTIONS: ChartConfiguration['options'] = {
  plugins: {
    legend: {
      position: 'bottom',
      fullSize: true,
      labels: {
        font: { size: 15 }
      }
    },
    title: {
      display: true,
      text: 'Ciudades Vistadas',
      font: { size: 20 }
    }
  }
};

const LINE_OPTIONS: ChartConfiguration['options'] = {
  scales: {
    y: { ticks: { font: {size: 20}}},
    x: { ticks: { font: {size: 20, weight: 'bold' }}}
  },
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Total de lempiras gastados en gasolina por mes',
      font: { size: 20 }
    }
  }
};

const BAR_OPTIONS: ChartConfiguration['options'] = {
  scales: {
    y: { ticks: { font: {size: 20}}},
    x: { ticks: { font: {size: 20, weight: 'bold'}}}
  },
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Total de kilometros recorridos por mes',
      font: { size: 25 }
    }
  }
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SideBarComponent, BaseChartDirective, LoadingComponent,
    CommonModule, BaseChartDirective, MatTooltipModule,
    NoResultComponent
  ],
  providers: [vehicleInfoHelper, PDFHelper],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public loading = true;
  public currentMonthInfo!: monthData;
  public lastMonthInfo!: monthData;
  public kms: { month: string; kms: number }[] = [];
  public cost: { month: string; cost: number }[] = [];
  public cities: { city: string; trips: number }[] = [];
  public vehicle: IVehicle = EMPTY_VEHICLE;
  public kmsDatasets: any[] = [];
  public kmsLabels: string[] = [];
  public cityDatasets: any[] = [];
  public cityLabels: string[] = [];
  public costDatasets: any[] = [];
  public costLabels: string[] = [];
  public pieOptions = PIE_OPTIONS;
  public emptyInfo = false;
  public lineOptions = LINE_OPTIONS;
  public barOptions = BAR_OPTIONS;
  @ViewChild('pie', { static: false }) public pie!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bar', { static: false }) public bar!: ElementRef<HTMLCanvasElement>;
  @ViewChild('line', { static: false }) public line!: ElementRef<HTMLCanvasElement>;

  constructor(
    private dashboardQuery: DashboardQueries,
    public vehicleInfoHelper: vehicleInfoHelper,
    private router: Router,
    private pdfHelper: PDFHelper
  ){}

  ngOnInit(): void {
    this.dashboardQuery.dashboardQuery().subscribe((data) => {
      if (typeof data === 'number') {
        this.loading = false;
        this.emptyInfo = true;
        return;
      }
      this.currentMonthInfo = data.current_month;
      this.lastMonthInfo = data.last_month;
      this.kms = data.kms;
      this.cost = data.cost;
      this.cities = data.cities;
      this.vehicle = data.vehicle;
      this.loading = false;
      this.generateGraphData();
    });
  }

  public goToVehicle(): void {
    this.router.navigate(['/admin/vehicle', this.vehicle.ID_Vehiculo]);
  }

  public currentMonthBigger(prop: string): boolean {
    switch (prop) {
      case 'gas':
        return this.lastMonthInfo.gas < this.currentMonthInfo.gas;
      case 'cost':
        return this.lastMonthInfo.cost < this.currentMonthInfo.cost;
      case 'kms':
        return this.lastMonthInfo.kms < this.currentMonthInfo.kms;
      case 'trip':
        return this.lastMonthInfo.trips < this.currentMonthInfo.trips;
      case 'request':
        return this.lastMonthInfo.requests < this.currentMonthInfo.requests;
    }
    return false;
  }

  public generateReport(): void {
    const pie = this.pie.nativeElement.toDataURL('image/png', 1.0);
    const bar = this.bar.nativeElement.toDataURL('image/png', 1.0);
    const line = this.line.nativeElement.toDataURL('image/png', 1.0);
    this.pdfHelper.generateMainReport(this.vehicle, this.currentMonthInfo, bar, pie, line);
  }

  private generateGraphData(): void {
    this.kmsDatasets = [{ data: this.kms.map((k) => k.kms), label: 'Total de Kilometros recorridos por mes' }];
    this.kmsLabels = this.kms.map((k) => k.month);
    this.cityDatasets = [{ data: this.cities.map((c) => c.trips), label: 'Viajes' }];
    this.cityLabels = this.cities.map((c) => c.city);
    this.costDatasets = [{ data: this.cost.map((c) => c.cost), fill: 'origin' }];
    this.costLabels = this.cost.map((c) => c.month);
  }
}
