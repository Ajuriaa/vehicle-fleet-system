import { IVehicle } from '../interfaces';

export class vehicleInfoHelper {
  public getModel(vehicle: IVehicle | undefined): string {
    if(!vehicle) return '';
    const brand = vehicle.TB_Modelo.TB_Marca_Vehiculo.Marca;
    const model = vehicle.TB_Modelo.Modelo;
    const year = vehicle.Anio;
    return `${brand} ${model} ${year}`;
  }

  public getType(vehicle: IVehicle): string {
    return vehicle.TB_Modelo.TB_Tipo_Vehiculo.Tipo_Vehiculo;
  }

  public getVehicleStatus(vehicle: IVehicle): string {
    return vehicle.TB_Estado_Vehiculo.Estado_Vehiculo;
  }
}
