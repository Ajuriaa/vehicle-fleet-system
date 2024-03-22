import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrimaryButtonComponent } from 'src/app/shared';
import { ILog } from '../../interfaces';
import { EMPTY_LOG } from 'src/app/core/helpers';

@Component({
  selector: 'app-log-passengers',
  standalone: true,
  imports: [PrimaryButtonComponent],
  templateUrl: './log-passengers.component.html',
  styleUrl: './log-passengers.component.scss'
})
export class LogPassengersComponent implements OnInit {
  public pasengerIds: string = '';

  constructor(
    private dialogRef: MatDialogRef<LogPassengersComponent>,
    @Inject(MAT_DIALOG_DATA) public log: ILog = EMPTY_LOG
  ){}

  ngOnInit(): void {
    this.pasengerIds = 'NOMBRE DEL USER';
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
