import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { SideBarComponent } from 'src/app/shared';
import { DashboardQueries } from '../../services';
import { IVehicle } from '../../interfaces';
import { vehicleInfoHelper } from '../../helpers';
import { Chart } from 'chart.js';

interface test {
  vehiculo: IVehicle;
  KilometrosRecorridos: number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideBarComponent, BaseChartDirective],
  providers: [vehicleInfoHelper],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public test: test[] = [];
  public datasets: any[] = [];
  public labels: string[] = [];

  constructor(
    private dashboardQuery: DashboardQueries,
    public vehicleInfoHelper: vehicleInfoHelper,
  ){}

  ngOnInit(): void {
    Chart.defaults.font.size = 40;
    this.dashboardQuery.test().subscribe((data) => {
      this.test = data;
      this.datasets = [{
        data: this.test.map((item) => item.KilometrosRecorridos),
        label: 'Top 3 vehiculos con kms recorridos'
      }];
      this.labels = this.test.map((item) => this.vehicleInfoHelper.getModel(item.vehiculo));
    });
  }
}
