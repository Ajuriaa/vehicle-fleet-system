import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { FuesWithLog, IDriver, IGasRefill, ILog, IRequest, IVehicle, IVehicleInfo } from 'src/app/admin/interfaces';
import { vehicleInfoHelper } from 'src/app/admin/helpers';

@Injectable({
  providedIn: 'root',
})
export class PDFHelper {
  private isFirstPageDrawn = false;
  constructor(private vehicleInfoHelper: vehicleInfoHelper) {}

  public generateVehicleReport(vehicle: IVehicle, month: IVehicleInfo): void {
    this.isFirstPageDrawn = false;
    const doc = new jsPDF('landscape');
    doc.setTextColor(40);
    const blue = '#88CFE0';

    doc.text('Estado:', 20, 55);
    doc.text('Kilometraje:', 65, 55);
    doc.text('KPG:', 120, 55);
    doc.text('CPK:', 165, 55);
    doc.text('Distancia Recorrida:', 210, 55);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(vehicle.Estado_Vehiculo.Estado_Vehiculo, 20, 62);
    doc.text(vehicle.Kilometraje + ' Km', 65, 62);
    doc.text(month.kpg + ' Km/Gal', 120, 62);
    doc.text(month.cpk + ' Lps/Km', 165, 62);
    doc.text(month.kms + ' Km', 210, 62);
    doc.setFont('Helvetica', 'normal');

    doc.setFontSize(20);
    const logColumns = [
      'Fecha',
      'Hora Salida',
      'Hora Regreso',
      'Conductor',
      'Pasajeros',
      'Ciudad',
      'Kilometraje Salida',
      'Kilometraje Entrada',
    ];
    // filter logs by the current month
    const currentLogs = vehicle.Bitacoras.filter((log) => {
      const logDate = moment(log.Fecha);
      const now = moment();
      return logDate.month() === now.month() && logDate.year() === now.year();
    });

    const formattedLogs = this.formatLogsForPDF(currentLogs);

    autoTable(doc, {
      head: [logColumns],
      body: formattedLogs,
      margin: { top: 85, right: 10, bottom: 20, left: 20 },
      styles: { halign: 'center', valign: 'middle' },
      headStyles: { fillColor: blue },
      didDrawPage: (data: any) => {

        doc.setFontSize(20);
        const pageSize = doc.internal.pageSize;
        moment.locale('es');
        const month = moment.utc().format('MMMM');
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        const title = 'Reporte de Vehículo' + ' - ' + capitalizedMonth;
        const centerX = pageSize.width / 2;
        const subtitle = this.vehicleInfoHelper.getModel(vehicle) + ' - ' + vehicle.Placa;
        doc.text(title, centerX - doc.getTextWidth(title) / 2, 25);
        doc.text(subtitle, centerX - doc.getTextWidth(subtitle) / 2, 35);
        doc.text('Bitácoras', centerX - doc.getTextWidth('Bitácoras')/2, 80);

        // Header
        if (!this.isFirstPageDrawn) {
          data.settings.margin.top = 4;
          doc.addImage('assets/pdf.jpg', 'JPEG', 20, 5, 40, 40);
          doc.addImage('assets/pdf2.jpg', 'JPEG', pageSize.width - 50, 2, 40, 40);
          this.isFirstPageDrawn = true;
        }
        // Left stripe
        const margin = 4;
        doc.setFillColor(blue);
        doc.rect(margin, margin, 10, pageSize.height - 2 * margin, 'F');
      },
    });
    doc.addPage();
    const fuelColumns = [
      'Fecha',
      'Estación',
      'Kilometraje',
      'Precio',
      'Cantidad',
      'Factura',
      'Orden',
    ];
    const formattedFuelOrders = this.formatFuelOrdersForPDF(currentLogs.map((log) => log.Llenados_Combustible).flat());
    autoTable(doc, {
      head: [fuelColumns],
      body: formattedFuelOrders,
      margin: { top: 45, right: 10, bottom: 20, left: 20 },
      styles: { halign: 'center', valign: 'middle' },
      headStyles: { fillColor: blue },
      didDrawPage: (data: any) => {
        const pageSize = doc.internal.pageSize;
        const centerX = pageSize.width / 2;
        doc.text('Llenados de Combustible', centerX - doc.getTextWidth('Llenados de Combustible')/2, 15);
        doc.setFontSize(17);
        doc.text('Cantidad de Gasolina:', 20, 30);
        doc.text('Costo:', 120, 30);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(month.gas + ' Galones', 20, 37);
        doc.text('L. ' + month.cost, 120, 37);

        // Left stripe
        const margin = 4;
        doc.setFillColor(blue);
        doc.rect(margin, margin, 10, pageSize.height - 2 * margin, 'F');
      },
    });
    const pageCount = (doc as any).internal.getNumberOfPages();
    const footerHeight = doc.internal.pageSize.height - 7;

    // Footer
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        'Página ' + i + ' de ' + pageCount,
        doc.internal.pageSize.width - 35,
        footerHeight
      );
      doc.text(
        'Reporte generado el ' + moment().format('DD/MM/YYYY'),
        25,
        footerHeight
      );
    }

    doc.output('dataurlnewwindow');
  }

  public generatePDF(
    formattedData: any[],
    columns: string[],
    title: string
  ): void {
    this.isFirstPageDrawn = false;
    const doc = new jsPDF('landscape');
    doc.setTextColor(40);
    const blue = '#88CFE0';

    autoTable(doc, {
      head: [columns],
      body: formattedData,
      margin: { top: 45, right: 10, bottom: 20, left: 20 },
      styles: { halign: 'center', valign: 'middle' },
      headStyles: { fillColor: blue },
      didDrawPage: (data) => {
        doc.setFontSize(20);
        const pageSize = doc.internal.pageSize;

        // Header
        if (!this.isFirstPageDrawn) {
          data.settings.margin.top = 4;
          const centerX = pageSize.width / 2;
          doc.text(title, centerX - doc.getTextWidth(title) / 2, 25);

          doc.addImage('assets/pdf.jpg', 'JPEG', 20, 5, 40, 40);
          doc.addImage('assets/pdf2.jpg', 'JPEG', pageSize.width - 50, 2, 40, 40);
          this.isFirstPageDrawn = true;
        }

        // Left stripe
        const margin = 4;
        doc.setFillColor(blue);
        doc.rect(margin, margin, 10, pageSize.height - 2 * margin, 'F');
      },
    });
    const pageCount = (doc as any).internal.getNumberOfPages();
    const footerHeight = doc.internal.pageSize.height - 7;

    // Footer
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        'Página ' + i + ' de ' + pageCount,
        doc.internal.pageSize.width - 35,
        footerHeight
      );
      doc.text(
        'Lista generada el ' + moment().format('DD/MM/YYYY'),
        25,
        footerHeight
      );
    }

    doc.output('dataurlnewwindow');
  }

  public generateVehiclesPDF(vehicles: IVehicle[]): void {
    const columns = ['Placa', 'Modelo', 'Tipo', 'Estado', 'Kilometraje'];
    const formattedVehicles = this.formatVehiclesForPDF(vehicles);
    this.generatePDF(formattedVehicles, columns, 'Listado de Vehículos');
  }

  public generateDriversPdf(drivers: IDriver[]): void {
    const columns = ['ID', 'Nombre', 'Solicitudes Finalizadas', 'Disponible'];
    const formattedDrivers = this.formatDriversForPDF(drivers);
    this.generatePDF(formattedDrivers, columns, 'Listado de Conductores');
  }

  public generateLogsPdf(logs: ILog[], vehicle: IVehicle): void {
    const columns = [
      'Fecha',
      'Hora Salida',
      'Hora Regreso',
      'Conductor',
      'Pasajeros',
      'Ciudad',
      'Kilometraje Salida',
      'Kilometraje Entrada',
    ];
    const formattedLogs = this.formatLogsForPDF(logs);
    this.generatePDF(
      formattedLogs,
      columns,
      'Listado de Bitácoras - ' + this.getVehicle(vehicle)
    );
  }

  public generateRequestsPdf(requests: IRequest[]): void {
    const columns = [
      'Estado',
      'Empleado',
      'Fecha',
      'Hora Salida',
      'Hora Entrada',
      'Ciudad',
      'Vehículo',
      'Conductor',
    ];
    const formattedDrivers = this.formatRequestsForPDF(requests);
    this.generatePDF(formattedDrivers, columns, 'Listado de Solicitudes');
  }

  public formatRequestsForPDF(requests: IRequest[]) {
    return requests.map((request) => {
      return [
        request.Estado_Solicitud.Estado,
        request.Nombre_Empleado,
        this.getDate(request.Fecha.toString()),
        this.getTime(request.Hora_Salida.toString()),
        this.getTime(request.Hora_Regreso.toString()),
        request.Ciudad.Nombre,
        this.getVehicle(request.Vehiculo),
        this.getDriver(request.Conductor),
      ];
    });
  }

  private formatFuelOrdersForPDF(fuelOrders: IGasRefill[]): any[] {
    return fuelOrders.map((fuelOrder) => {
      const unit = fuelOrder.Unidad_Combustible.Unidad;
      const unitPlural = unit === 'Litro' ? 's' : 'es';
      const quantity = fuelOrder.Cantidad + ' ' + unit + unitPlural;
      return [
        this.getDate(fuelOrder.Fecha.toString()),
        fuelOrder.Estacion_Combustible,
        fuelOrder.Kilometraje_Recarga,
        'L. ' + fuelOrder.Precio,
        quantity,
        fuelOrder.Numero_Factura,
        fuelOrder.Numero_Orden,
      ];
    });
  }

  private formatLogsForPDF(logs: ILog[]): any[] {
    return logs.map((log) => {
      return [
        this.getDate(log.Fecha.toString()),
        this.getTime(log.Hora_Salida.toString()),
        this.getTime(log.Hora_Entrada.toString()),
        this.getDriver(log.Conductor),
        log.Pasajeros.length,
        log.Ciudad.Nombre,
        log.Kilometraje_Salida,
        log.Kilometraje_Entrada,
      ];
    });
  }

  private formatDriversForPDF(drivers: IDriver[]): any[] {
    return drivers.map((driver) => {
      return [
        driver.ID_Conductor,
        driver.Nombre,
        driver.Solicitudes_Finalizadas,
        driver.Disponible ? 'Sí' : 'No',
      ];
    });
  }

  private formatVehiclesForPDF(vehicles: IVehicle[]): any[] {
    return vehicles.map((vehicle) => {
      return [
        vehicle.Placa,
        this.vehicleInfoHelper.getModel(vehicle),
        this.vehicleInfoHelper.getType(vehicle),
        this.vehicleInfoHelper.getVehicleStatus(vehicle),
        vehicle.Kilometraje,
      ];
    });
  }

  private getDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  private getTime(time: string): string {
    return moment(time).tz('America/Tegucigalpa').format('hh:mm');
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
