import { ICity, IVehicle, IDriver } from ".";

export interface IRequest {
  ID_Solicitud: number;
  ID_Empleado: number;
  Nombre_Empleado: string;
  Destino: string;
  Motivo: string;
  Fecha: Date;
  Hora_Salida: Date;
  Hora_Regreso: Date;
  TB_Ciudad: ICity;
  TB_Vehiculo?: IVehicle;
  TB_Estado_Solicitud: IRequestStatus;
  TB_Tipo_Solicitud: IRequestType;
  TB_Conductor?: IDriver;
}

export interface IRequestStatus {
  ID_Estado_Solicitud: number;
  Estado: string;
}

export interface IRequestType {
  ID_Tipo_Solicitud: number;
  Tipo_Solicitud: string;
}

export interface IRequestsResponse {
  data: IRequest[];
}

export interface IRequestResponse {
  data: IRequest;
}
