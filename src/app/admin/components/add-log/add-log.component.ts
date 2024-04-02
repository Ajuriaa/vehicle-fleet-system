import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import moment from 'moment';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PrimaryButtonComponent } from 'src/app/shared';
import { ILog } from '../../interfaces';
import { EMPTY_DRIVER, EMPTY_VEHICLE } from 'src/app/core/helpers';

@Component({
  selector: 'app-add-log',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, FormsModule,
    ReactiveFormsModule, CommonModule, MatInputModule,
    MatAutocompleteModule, AsyncPipe, MatSelectModule,
    MatDatepickerModule, NgxMaterialTimepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-log.component.html',
  styleUrl: './add-log.component.scss'
})
export class AddLogComponent implements OnInit {
  public logDataForm!: FormGroup;
  public maxDate: Date = new Date();
  public error = false;
  public isLater = false;
  public badKms = false;
  @Inject(MAT_DIALOG_DATA) public minKm = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddLogComponent>,
    ) { }

  ngOnInit(): void {
    this.logDataForm = this._formBuilder.group({
      Kilometraje_Entrada: [0, [Validators.required]],
      Kilometraje_Salida: [0, [Validators.required]],
      Hora_Salida: ['', [Validators.required]],
      Hora_Entrada: ['', [Validators.required]],
      Fecha: ['', [Validators.required]],
      Destino: ['', [Validators.required]],
      Observaciones: [''],
      Pasajeros: ['', [Validators.required]],
    });
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(): void {
    if(!this.validateErrors()) {
      return;
    }moment('02:54 PM', 'h:mm A').format('HH:mm:ss')

    const data = {
      ID_Bitacora: 0,
      Fecha: this.logDataForm.controls.Fecha.value,
      Destino: this.logDataForm.controls.Destino.value,
      Kilometraje_Entrada: this.logDataForm.controls.Kilometraje_Entrada.value,
      Kilometraje_Salida: this.logDataForm.controls.Kilometraje_Salida.value,
      Hora_Salida: this.logDataForm.controls.Hora_Salida.value,
      Hora_Entrada: this.logDataForm.controls.Hora_Entrada.value,
      Observaciones: this.logDataForm.controls.Observaciones.value,
      Pasajeros: this.logDataForm.controls.Pasajeros.value
    }

    this.dialogRef.close(data);
  }

  private validateErrors(): boolean {
    this.error = false;
    this.isLater = false;
    this.badKms = false;
    let valid = true;

    if (this.logDataForm.invalid) {
      this.error = true;
      valid = false;
    }

    if (this.logDataForm.controls.Kilometraje_Entrada.value < this.logDataForm.controls.Kilometraje_Salida.value) {
      this.badKms = true;
      valid = false;
    }

    const timeFormat = 'h:mm A';
    const exitTime = this.logDataForm.controls.Hora_Salida.value;
    const entryTime = this.logDataForm.controls.Hora_Entrada.value;
    if (moment(entryTime, timeFormat).isBefore(moment(exitTime, timeFormat))) {
      this.isLater = true;
      valid = false;
    }

    return valid;
  }
}
