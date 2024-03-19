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
        vehicle.TB_Estado_Vehiculo.Estado_Vehiculo.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === 'drivers') {
      return data.filter((driver: IDriver)  =>
        driver.Nombre.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === 'requests') {
      return data.filter((request: IRequest)  =>
        request.TB_Ciudad.Nombre.toLowerCase().includes(term.toLowerCase()) ||
        request.Nombre_Empleado.toLowerCase().includes(term.toLowerCase()) ||
        request.TB_Conductores?.Nombre.toLowerCase().includes(term.toLowerCase()) ||
        request.TB_Vehiculos?.Placa.toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleModel(request.TB_Vehiculos).toLowerCase().includes(term.toLowerCase()) ||
        moment(request.Fecha).format('DD/MM/YYYY').toLowerCase().includes(term.toLowerCase()) ||
        request.TB_Estado_Solicitud.Estado.toLowerCase().includes(term.toLowerCase())
      );
    }
    return data;
  }

  public getVehicleModel(vehicle: IVehicle | undefined): string {
    if(!vehicle) return '';
    const brand = vehicle.TB_Modelo.TB_Marca_Vehiculo.Marca;
    const model = vehicle.TB_Modelo.Modelo;
    const year = vehicle.Anio;
    return `${brand} ${model} ${year}`;
  }

  public getVehicleType(vehicle: IVehicle): string {
    return vehicle.TB_Modelo.TB_Tipo_Vehiculo.Tipo_Vehiculo;
  }
}
