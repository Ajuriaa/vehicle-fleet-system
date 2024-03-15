import { ILog } from ".";

export interface IVehicle {
  ID_Vehiculo: number;
  Placa: string;
  Kilometraje: number;
  Chasis: string;
  Motor: string;
  KPG: number;
  Imagen_URL: string;
  Anio: number;
  Kilometraje_Mantenimiento: number;
  Color: string;
  TB_Estado_Vehiculo: IVehicleState;
  TB_Modelo: IModel;
  TB_Bitacoras: ILog[];
  Siguiente_Mantenimiento?: number;
}

export interface IModel {
  ID_Modelo: number;
  Modelo: string;
  TB_Marca_Vehiculo: IBrand;
  TB_Tipo_Vehiculo: IVehicleType;
}

export interface IBrand {
  ID_Marca_Vehiculo: number;
  Marca: string;
}

export interface IVehicleState {
  ID_Estado_Vehiculo: number;
  Estado_Vehiculo: string;
}

export interface IVehicleType {
  ID_Tipo_Vehiculo: number;
  Tipo_Vehiculo: string;
}

export interface IVehicleResponse {
  data: IVehicle;
}

export interface IVehiclesResponse {
  data: IVehicle[];
  maintenance: { id: number, kms: number };
}
