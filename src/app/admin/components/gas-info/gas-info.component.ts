import { Component, Inject, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from 'src/app/shared/buttons';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY_GAS_REFILL, EMPTY_LOG } from 'src/app/core/helpers';
import { IGasRefill, ILog } from '../../interfaces';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import 'moment/min/locales';

@Component({
  selector: 'app-gas-info',
  standalone: true,
  imports: [PrimaryButtonComponent, CommonModule],
  templateUrl: './gas-info.component.html',
  styleUrl: './gas-info.component.scss'
})
export class GasInfoComponent implements OnInit {
  public gasRefill: IGasRefill = EMPTY_GAS_REFILL;
  public date = '';
  public quantity = '';
  public isCreate = false;

  constructor(
    private dialogRef: MatDialogRef<GasInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { log: ILog, modalType: string }
  ){}

  ngOnInit(): void {
    moment.locale('es');
    this.isCreate = this.data.modalType === 'create';
    this.setData();
  }

  private setData(): void {
    if (this.isCreate) {
      return;
    }

    this.gasRefill = this.data.log.Llenados_Combustible[0];
    this.date = moment(this.gasRefill.Fecha).format('dddd LL');
    this.quantity = this.gasRefill.Cantidad + ' ' + this.gasRefill.Unidad_Combustible.Unidad + 's';
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
