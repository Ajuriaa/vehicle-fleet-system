import { Component, OnInit } from '@angular/core';
import { PDFHelper } from 'src/app/core/helpers/pdf-generator.helper';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/core/services';
import { IDriver } from '../../interfaces';
import { DriverQueries } from '../../services';
import { vehicleInfoHelper } from '../../helpers';
import { CreateUpdateDriverComponent, DeleteDriverComponent } from '../../components';
import { EMPTY_DRIVER } from 'src/app/core/helpers';

const TABLE_COLUMNS = ['id', 'name', 'endedRequestCount', 'available', 'edit'];

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, PrimaryButtonComponent, LoadingComponent],
  providers: [DriverQueries, PDFHelper, vehicleInfoHelper],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {
  public searchInput = '';
  public displayedColumns: string[] = TABLE_COLUMNS;
  public availableDrivers = 0;
  public drivers: IDriver[] = [];
  public filteredDrivers: IDriver[] = [];
  public loading = true;

  constructor(
    private driverQuery: DriverQueries,
    private dialog: MatDialog,
    private router: Router,
    private searchEngine: SearchService,
    private pdfHelper: PDFHelper,
  ) {}

  ngOnInit(): void {
    this.getallDrivers();
  }

  public onSearch(term: string): void {
    this.filteredDrivers = this.searchEngine.filterData(this.drivers, term, 'drivers');
  }

  public driverInfo(driverId: number): void {
    this.router.navigate([`/admin/driver/`, driverId]);
  }

  public generatePdf(): void {
    this.pdfHelper.generateDriversPdf(this.drivers);
  }

  public openDeleteDriverModal(driver: IDriver): void {
    this.dialog.open(DeleteDriverComponent, {
      panelClass: 'dialog-style',
      data: {
        id: driver.ID_Conductor,
        name: driver.Nombre
      }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getallDrivers();
      }
    });
  }

  public openCreateUpdateDriverModal(modalType: string = 'create', driver: IDriver = EMPTY_DRIVER): void {
    this.dialog.open(CreateUpdateDriverComponent, {
      panelClass: 'dialog-style',
      data: { driver, modalType }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getallDrivers();
      }
    });
  }

  private getallDrivers(): void {
    this.driverQuery.getAllDrivers().subscribe(({data}) => {
      if(data){
        this.drivers = data;
        this.availableDrivers = this.drivers.filter(driver => driver.Disponible).length;
        this.filteredDrivers = this.drivers;
        this.loading = false;
      }
    });
  }
}
