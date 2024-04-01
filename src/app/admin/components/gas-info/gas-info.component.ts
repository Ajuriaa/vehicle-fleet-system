import { Component, Inject, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from 'src/app/shared/buttons';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY_GAS_REFILL, EMPTY_LOG } from 'src/app/core/helpers';
import { IGasRefill, ILog } from '../../interfaces';

@Component({
  selector: 'app-gas-info',
  standalone: true,
  imports: [PrimaryButtonComponent],
  templateUrl: './gas-info.component.html',
  styleUrl: './gas-info.component.scss'
})
export class GasInfoComponent implements OnInit {
  public gasRefill: IGasRefill = EMPTY_GAS_REFILL;
  constructor(
    private dialogRef: MatDialogRef<GasInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public log: ILog = EMPTY_LOG
  ){}

  ngOnInit(): void {
    this.gasRefill = this.log.Llenados_Combustible[0];
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
