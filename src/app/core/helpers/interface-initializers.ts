import { IVehicle, IModel, IBrand, IVehicleState, IVehicleType, IVehicleResponse } from "src/app/admin/interfaces";

export const EMPTY_BRAND: IBrand = {
  ID_Marca_Vehiculo: 0,
  Marca: ''
};

export const EMPTY_VEHICLE_STATE: IVehicleState = {
  ID_Estado_Vehiculo: 0,
  Estado_Vehiculo: ''
};

export const EMPTY_VEHICLE_TYPE: IVehicleType = {
  ID_Tipo_Vehiculo: 0,
  Tipo_Vehiculo: ''
};

export const EMPTY_VEHICLE_RESPONSE: IVehicleResponse = {
  data: [],
  maintenance: { id: 0, kms: 0 }
};

export const EMPTY_MODEL: IModel = {
  ID_Modelo: 0,
  Modelo: '',
  TB_Marca_Vehiculo: EMPTY_BRAND,
  TB_Tipo_Vehiculo: EMPTY_VEHICLE_TYPE
};

export const EMPTY_VEHICLE: IVehicle = {
  ID_Vehiculo: 0,
  Placa: '',
  Kilometraje: 0,
  Chasis: '',
  Motor: '',
  KPG: 0,
  Imagen_URL: '',
  Anio: 0,
  Kilometraje_Mantenimiento: 0,
  Color: '',
  TB_Estado_Vehiculo: EMPTY_VEHICLE_STATE,
  TB_Modelo: EMPTY_MODEL,
  Siguiente_Mantenimiento: 0
};
