import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { IVehicle } from 'src/app/admin/interfaces';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { vehicleInfoHelper } from 'src/app/admin/helpers';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-maintenance-card',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, MatInputModule, CommonModule],
  providers: [provideNativeDateAdapter(), vehicleInfoHelper],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './maintenance-card.component.html',
  styleUrl: './maintenance-card.component.scss'
})
export class MaintenanceCardComponent implements OnChanges {
  public model = '';
  public remainingKms = 0;
  public preventiveDates: string[] = [];
  public correctiveDates: string[] = [];
  public lastMaintenanceDate = new Date();
  @Input() public vehicle!: IVehicle;

  constructor(
    private vehicleInfoHelper: vehicleInfoHelper
  ){}

  ngOnChanges(): void {
    this.model = this.vehicleInfoHelper.getModel(this.vehicle);
    this.remainingKms = this.getNextMaintenanceKms();
    this.preventiveDates = this.getDates('Preventivo');
    this.correctiveDates = this.getDates('Correctivo');
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.toDateString();
      let dateClass = '';
      if (this.preventiveDates.includes(date)) {
        dateClass = 'preventive-date';
      } else if (this.correctiveDates.includes(date)) {
        dateClass = 'corrective-date';
      }
      return dateClass;
    }
    return '';
  };

  private getDates(type: 'Preventivo' | 'Correctivo'): string[] {
    if(!this.vehicle.Mantenimientos) return [];
    const dates = this.vehicle.Mantenimientos
                  .filter(m => m.Tipo_Mantenimiento === type)
                  .map(m => moment.utc(m.Fecha).format('ddd MMM DD YYYY'));
    return dates;
  }

  private getNextMaintenanceKms(): number {
    if(!this.vehicle?.Mantenimientos) return 0;
    const lastMaintenance = this.vehicle.Mantenimientos
                                   .filter(m => m.Tipo_Mantenimiento === 'Preventivo')
                                   .sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha)
                                   .getTime())[0];
    const lastMaintenanceKms = lastMaintenance.Kilometraje;
    const nextMaintenance = lastMaintenanceKms + 5000;
    this.lastMaintenanceDate = lastMaintenance.Fecha;
    return nextMaintenance - this.vehicle.Kilometraje;
  }
}
