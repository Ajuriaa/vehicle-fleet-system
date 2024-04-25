import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY_VEHICLE } from 'src/app/core/helpers';
import { IVehicle } from '../../interfaces';
import { VehicleQueries } from '../../services';
import { vehicleInfoHelper } from '../../helpers';
import { CommonModule } from '@angular/common';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    CommonModule, LoadingComponent, PrimaryButtonComponent
  ],
  providers: [vehicleInfoHelper],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnInit {
  public loading = true;
  public vehicleId = this.route.snapshot.params.id;
  public vehicle: IVehicle = EMPTY_VEHICLE;
  public model = '';

  constructor(
    public vehicleHelper: vehicleInfoHelper,
    private route: ActivatedRoute,
    private router: Router,
    private vehicleQuery: VehicleQueries
  ){}

  ngOnInit(): void {
    this.getVehicle();
  }

  public goToLogs(): void {
    this.router.navigate([`/admin/log/${this.vehicleId}`]);
  }

  public goToRequests(): void {
    this.router.navigate([`/admin/requests/${this.vehicleId}`]);
  }

  private getVehicle(): void {
    this.vehicleQuery.getVehicle(this.vehicleId).subscribe(({data}) => {
      this.vehicle = data;
      this.model = this.vehicleHelper.getModel(this.vehicle);
      this.loading = false;
    });
  }
}
