import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import moment from 'moment';
import autoTable from 'jspdf-autotable';
import { IDriver, IRequest, IVehicle } from 'src/app/admin/interfaces';
import { vehicleInfoHelper } from 'src/app/admin/helpers';

@Injectable({
  providedIn: 'root'
})
export class PDFHelper {
  private isFirstPageDrawn = false;
  constructor(private vehicleInfoHelper: vehicleInfoHelper) {}

  public generatePDF(formattedData: any[], columns: string[], title: string): void {
    const doc = new jsPDF('landscape');

    autoTable(doc, {
      head: [columns],
      body: formattedData,
      didDrawPage: (data) => {
        doc.setFontSize(20);
        doc.setTextColor(40);

        // Header
        if (!this.isFirstPageDrawn) {
          const text = title + ' - ' + moment().format('DD/MM/YYYY');
          doc.setFontSize(20);
          doc.setTextColor(40);

          // Header
          //doc.addImage('assets/pdf.jpg', 'JPEG', data.settings.margin.left, 15, 60, 10);
          doc.text(text, data.settings.margin.left, 22);

          this.isFirstPageDrawn = true;
        }
      },
      margin: { top: 30 },
      styles: { halign: 'center' },
      headStyles: { fillColor: [82, 204, 222] }
    });

    doc.output('dataurlnewwindow');
  }

  public generateVehiclesPDF(vehicles: IVehicle[]): void {
    const columns = ['Placa', 'Modelo', 'Tipo', 'Estado', 'Kilometraje'];
    const formattedVehicles = this.formatVehiclesForPDF(vehicles);
    this.generatePDF(formattedVehicles, columns, 'Listado de Vehículos',);
  }

  public generateDriversPdf(drivers: IDriver[]): void {
    const columns = ['ID', 'Nombre', 'Solicitudes Finalizadas', 'Disponible'];
    const formattedDrivers = this.formatDriversForPDF(drivers);
    this.generatePDF(formattedDrivers, columns, 'Listado de Conductores');
  }

  public generateRequestsPdf(requests: IRequest[]): void {
    const columns = ['Estado', 'Empleado', 'Fecha', 'Hora Salida', 'Hora Entrada', 'Ciudad', 'Vehículo', 'Conductor'];
    const formattedDrivers = this.formatRequestsForPDF(requests);
    this.generatePDF(formattedDrivers, columns, 'Listado de Solicitudes');
  }

  public formatRequestsForPDF(requests: IRequest[]) {
    return requests.map(request => {
      return [
        request.TB_Estado_Solicitud.Estado,
        request.Nombre_Empleado,
        this.getDate(request.Fecha.toString()),
        this.getTime(request.Hora_Salida.toString()),
        this.getTime(request.Hora_Regreso.toString()),
        request.TB_Ciudad.Nombre,
        this.getVehicle(request.TB_Vehiculos),
        this.getDriver(request.TB_Conductores)
      ];
    });
  }

  private formatDriversForPDF(drivers: IDriver[]): any[] {
    return drivers.map(driver => {
      return [
        driver.ID_Conductor,
        driver.Nombre,
        driver.Solicitudes_Finalizadas,
        driver.Disponible ? 'Sí' : 'No'
      ];
    });
  }

  private formatVehiclesForPDF(vehicles: IVehicle[]): any[] {
    return vehicles.map(vehicle => {
      return [
        vehicle.Placa,
        this.vehicleInfoHelper.getModel(vehicle),
        this.vehicleInfoHelper.getType(vehicle),
        this.vehicleInfoHelper.getVehicleStatus(vehicle),
        vehicle.Kilometraje
      ];
    });
  }

  private getDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  private getTime(time: string): string {
    return moment(time).tz("America/Tegucigalpa").format('hh:mm');
  }

  private getVehicle(vehicle: IVehicle | undefined): string {
    if (!vehicle) return 'N/A';
    const model = this.vehicleInfoHelper.getModel(vehicle);
    const plate = vehicle.Placa;
    return `${model} - ${plate}`;
  }

  private getDriver(driver: IDriver | undefined): string {
    if (!driver) return 'N/A';
    return driver.Nombre;
  }
}

