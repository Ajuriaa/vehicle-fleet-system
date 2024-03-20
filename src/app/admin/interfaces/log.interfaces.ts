export interface ILog {
  ID_Bitacora: number;
  Kilometraje_Entrada: number;
  Kilometraje_Salida: number;
  Hora_Salida: Date;
  Hora_Entrada: Date;
  Fecha: Date;
  Observaciones: string;
  Llenado_Combustible: IGasRefill;
}

export interface IGasRefill {
  ID_Llenado_Combustible: number;
  Cantidad: number;
  Estacion_Combustible: string;
  Kilometraje_Recarga: number;
  Fecha: Date;
  Precio: number;
  Unidad_Combustible: IGasUnit;
}

export interface IGasUnit {
  ID_Unidad_Combustible: number;
  Unidad: string;
}
