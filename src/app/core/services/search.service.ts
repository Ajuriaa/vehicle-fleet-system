import { Injectable } from '@angular/core';
import { IVehicle } from 'src/app/admin/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() {}

  public filterData(data: any[], term: string, dataModel: string): any[] {
    if( dataModel === 'vehicles') {
      return data.filter((vehicle: IVehicle)  =>
        vehicle.Placa.toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleModel(vehicle).toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleType(vehicle).toLowerCase().includes(term.toLowerCase()) ||
        vehicle.TB_Estado_Vehiculo.Estado_Vehiculo.toLowerCase().includes(term.toLowerCase())
      );
    }
    return data;
  }

  public getVehicleModel(vehicle: IVehicle): string {
    const brand = vehicle.TB_Modelo.TB_Marca_Vehiculo.Marca;
    const model = vehicle.TB_Modelo.Modelo;
    const year = vehicle.Anio;
    return `${brand} ${model} ${year}`;
  }

  public getVehicleType(vehicle: IVehicle): string {
    return vehicle.TB_Modelo.TB_Tipo_Vehiculo.Tipo_Vehiculo;
  }
}
