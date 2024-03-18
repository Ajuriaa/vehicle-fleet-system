import {
  IVehicle, IModel, IBrand,
  IVehicleStatus, IVehicleType, IGasRefill,
  IGasUnit, ILog, IDriver
} from "src/app/admin/interfaces";

export const EMPTY_DRIVER: IDriver = {
  ID_Conductor: 0,
  Nombre: "",
  Solicitudes_Finalizadas: 0,
  Disponible: false
}

export const EMPTY_BRAND: IBrand = {
  ID_Marca_Vehiculo: 0,
  Marca: ''
};

export const EMPTY_VEHICLE_STATE: IVehicleStatus = {
  ID_Estado_Vehiculo: 0,
  Estado_Vehiculo: ''
};

export const EMPTY_VEHICLE_TYPE: IVehicleType = {
  ID_Tipo_Vehiculo: 0,
  Tipo_Vehiculo: ''
};

export const EMPTY_MODEL: IModel = {
  ID_Modelo: 0,
  Modelo: '',
  TB_Marca_Vehiculo: EMPTY_BRAND,
  TB_Tipo_Vehiculo: EMPTY_VEHICLE_TYPE
};

export const EMPTY_GAS_UNIT: IGasUnit = {
  ID_Unidad_Combustible: 0,
  Unidad: '',
};

export const EMPTY_GAS_REFILL: IGasRefill = {
  ID_Llenado_Combustible: 0,
  Cantidad: 0,
  Estacion_Combustible: '',
  Kilometraje_Recarga: 0,
  Fecha: new Date(),
  Precio: 0,
  TB_Unidad_Combustible: EMPTY_GAS_UNIT,
};

export const EMPTY_LOG: ILog = {
  ID_Bitacora: 0,
  Kilometraje_Entrada: 0,
  Kilometraje_Salida: 0,
  Hora_Salida: new Date(),
  Hora_Entrada: new Date(),
  Fecha: new Date(),
  Observaciones: '',
  TB_Llenado_Combustible: EMPTY_GAS_REFILL,
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
  Siguiente_Mantenimiento: 0,
  TB_Bitacoras: []
};
