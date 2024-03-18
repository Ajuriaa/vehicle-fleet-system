import { Component, OnInit } from '@angular/core';
import { DriverQueries } from '../../services';
import { PDFHelper } from 'src/app/core/helpers/pdf-generator.helper';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from 'src/app/shared';
import { IDriver } from '../../interfaces';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/core/services';
import { vehicleInfoHelper } from '../../helpers';

const TABLE_COLUMNS = ['id', 'name', 'endedRequestCount', 'available', 'edit'];

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, PrimaryButtonComponent],
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

  public generatePdf(): void {
    this.pdfHelper.generateDriversPdf(this.drivers);
  }

  private getallDrivers(): void {
    this.driverQuery.getAllDrivers().subscribe(({data}) => {
      if(data){
        this.drivers = data;
        this.availableDrivers = this.drivers.filter(driver => driver.Disponible).length;
        this.filteredDrivers = this.drivers;
      }
    });
  }
}
