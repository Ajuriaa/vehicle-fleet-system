import { Component, Inject, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from 'src/app/shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBrand, IModel, IVehicle, IVehicleType } from '../../interfaces';
import { VehicleMutations, VehicleQueries } from '../../services';
import { MatCommonModule } from '@angular/material/core';

@Component({
  selector: 'app-create-update-vehicle',
  standalone: true,
  imports: [
    PrimaryButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [VehicleMutations],
  templateUrl: './create-update-vehicle.component.html',
  styleUrl: './create-update-vehicle.component.scss'
})
export class CreateUpdateVehicleComponent implements OnInit{
  public isCreate = false;
  public vehicleForm!: FormGroup;
  public brands: IBrand[] = [];
  public models: IModel[] = [];
  public vehicleTypes: IVehicleType[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private vehicleMutation: VehicleMutations,
    private vehicleQuery: VehicleQueries,
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
      vehicleStatus:['', [Validators.required]]
    });

    this.fillForm();
  }

  public onCancel(): void {
    this.dialogRef.close(true);
  }

  public async deleteVehicle(): Promise<void> {
    const data = {
      ID_Vehiculo: this.data.vehicle.ID_Vehiculo,
      Placa: this.vehicleForm.controls['plate'].value,
      Kilometraje: this.vehicleForm.controls['kms'].value,
      Chasis: this.vehicleForm.controls['chasis'].value,
      Motor: this.vehicleForm.controls['motor'].value,
      KPG: this.vehicleForm.controls['kpg'].value,
      Imagen_URL: this.vehicleForm.controls['img'].value,
      Anio: this.vehicleForm.controls['year'].value,
      Kilometraje_Mantenimiento: this.vehicleForm.controls['maintenanceKms'].value,
      Color: this.vehicleForm.controls['color'].value,
      ID_Modelo: this.vehicleForm.controls['model'].value,
      ID_Marca: this.vehicleForm.controls['brand'].value,
      ID_Estado_Vehiculo: this.vehicleForm.controls['brand'].value
    };

    const mutationResponse = this.isCreate ? await this.vehicleMutation.createVehicle(data) : true;

    if (mutationResponse) {
      this.onCancel();
    }
  }

  private fillForm(): void {
    if(this.isCreate) {
      return;
    }

    this.vehicleForm.patchValue({
      plate: this.data.vehicle.Placa,
      kms: this.data.vehicle.Kilometraje,
      chasis: this.data.vehicle.Chasis,
      motor: this.data.vehicle.Motor,
      kpg: this.data.vehicle.KPG,
      img: this.data.vehicle.Imagen_URL,
      year: this.data.vehicle.Anio,
      maintenanceKms: this.data.vehicle.Kilometraje_Mantenimiento,
      color: this.data.vehicle.Color,
      model: this.data.vehicle.TB_Modelo.Modelo,
      brand: this.data.vehicle.TB_Modelo.TB_Marca_Vehiculo.Marca,
      vehicleStatus: this.data.vehicle.TB_Estado_Vehiculo.Estado_Vehiculo
    });
  }
}
