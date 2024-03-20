import { Injectable } from '@angular/core';
import moment from 'moment';
import { IDriver, IRequest, IVehicle } from 'src/app/admin/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() {}

  public filterData(data: any[], term: string, dataModel: string): any[] {
    if(dataModel === 'vehicles') {
      return data.filter((vehicle: IVehicle)  =>
        vehicle.Placa.toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleModel(vehicle).toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleType(vehicle).toLowerCase().includes(term.toLowerCase()) ||
        vehicle.Estado_Vehiculo.Estado_Vehiculo.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === 'drivers') {
      return data.filter((driver: IDriver)  =>
        driver.Nombre.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === 'requests') {
      return data.filter((request: IRequest)  =>
        request.Ciudad.Nombre.toLowerCase().includes(term.toLowerCase()) ||
        request.Nombre_Empleado.toLowerCase().includes(term.toLowerCase()) ||
        request.Conductor?.Nombre.toLowerCase().includes(term.toLowerCase()) ||
        request.Vehiculo?.Placa.toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleModel(request.Vehiculo).toLowerCase().includes(term.toLowerCase()) ||
        moment(request.Fecha).format('DD/MM/YYYY').toLowerCase().includes(term.toLowerCase()) ||
        request.Estado_Solicitud.Estado.toLowerCase().includes(term.toLowerCase())
      );
    }
    return data;
  }

  public getVehicleModel(vehicle: IVehicle | undefined): string {
    if(!vehicle) return '';
    const brand = vehicle.Modelo.Marca_Vehiculo.Marca;
    const model = vehicle.Modelo.Modelo;
    const year = vehicle.Anio;
    return `${brand} ${model} ${year}`;
  }

  public getVehicleType(vehicle: IVehicle): string {
    return vehicle.Modelo.Tipo_Vehiculo.Tipo_Vehiculo;
  }
}
