import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY_VEHICLE } from 'src/app/core/helpers';
import { IVehicle } from '../../interfaces';
import { VehicleQueries } from '../../services';
import { vehicleInfoHelper } from '../../helpers';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [],
  providers: [vehicleInfoHelper],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnInit {
  public vehicle: IVehicle = EMPTY_VEHICLE;
  public model = '';

  constructor(
    private route: ActivatedRoute,
    private vehicleQuery: VehicleQueries,
    private vehicleHelper: vehicleInfoHelper
  ){}

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.params.id;

    this.vehicleQuery.getVehicle(vehicleId).subscribe(({data}) => {
      this.vehicle = data;
      this.model = this.vehicleHelper.getModel(this.vehicle);
    });
  }
}
