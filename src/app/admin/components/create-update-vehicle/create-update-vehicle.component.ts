import { Component, Inject, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from 'src/app/shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IVehicle } from '../../interfaces';
import { VehicleMutations } from '../../services';

@Component({
  selector: 'app-create-update-vehicle',
  standalone: true,
  imports: [
    PrimaryButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [VehicleMutations],
  templateUrl: './create-update-vehicle.component.html',
  styleUrl: './create-update-vehicle.component.scss'
})
export class CreateUpdateVehicleComponent implements OnInit{
  public isCreate = false;
  public vehicleForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    public vehicleMutation: VehicleMutations,
    public dialogRef: MatDialogRef<CreateUpdateVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: IVehicle, modalType: string }
  ){}

  ngOnInit(): void {
    this.isCreate = this.data.modalType === 'create';
    this.vehicleForm = this._formBuilder.group({
      plate: ['', [Validators.required]],
      kms: ['', [Validators.required]],
      chasis: ['', [Validators.required]],
      motor: ['', [Validators.required]],
      kpg: [0, [Validators.required]],
      img: ['', [Validators.required]],
      year: [0, [Validators.required]],
      maintenanceKms: [0, [Validators.required]],
      color: ['', [Validators.required]],
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      vehicleStatus:[0, [Validators.required]]
    });
  }

  public onCancel(): void {
    this.dialogRef.close(true);
  }

  public async deleteVehicle(): Promise<void> {
    const data = {
      Placa: '',
      Kilometraje: '',
      Chasis: '',
      Motor: '',
      KPG: '',
      Imagen_URL: '',
      Anio: '',
      Kilometraje_Mantenimiento: '',
      Color: '',
      ID_Modelo: '',
      ID_Estado_Vehiculo: ''
    };

    //const mutationResponse = await this.vehicleMutation.deleteVehicle(+this.id);

    if (true) {
      this.onCancel();
    }
  }
}
