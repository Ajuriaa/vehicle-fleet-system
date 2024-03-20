import { Component, Inject, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from 'src/app/shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { VehicleMutations, VehicleQueries } from '../../services';
import { IBrand, IModel, IVehicle, IVehicleStatus, IVehicleType } from '../../interfaces';

@Component({
  selector: 'app-create-update-vehicle',
  standalone: true,
  imports: [
    PrimaryButtonComponent, CommonModule,
    FormsModule, ReactiveFormsModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    MatOptionModule, MatSelectModule
  ],
  providers: [VehicleMutations],
  templateUrl: './create-update-vehicle.component.html',
  styleUrl: './create-update-vehicle.component.scss'
})
export class CreateUpdateVehicleComponent implements OnInit{
  public isCreate = false;
  public vehicleType = '';
  public currentYear = new Date().getFullYear();
  public vehicleForm!: FormGroup;
  public brands: IBrand[] = [];
  public models: IModel[] = [];
  public filteredModels: IModel[] = [];
  public vehicleTypes: IVehicleType[] = [];
  public statuses: IVehicleStatus[] = [];

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
      kpg: ['', [Validators.required]],
      img: ['', [Validators.required]],
      year: ['', [Validators.required]],
      color: ['', [Validators.required]],
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      status:['', [Validators.required]],
      vehicleType:['', [Validators.required]]
    });

    this.fetchData();
    this.fillForm();
  }

  public fetchData(): void {
    this.vehicleQuery.getBrands().subscribe(({data}) => {
      this.brands = data;
    });
    this.vehicleQuery.getModels().subscribe(({data}) => {
      this.models = data;
      if(this.isCreate) {
        this.filteredModels = this.models;
      } else {
        this.filterModels(this.data.vehicle.Modelo.Marca_Vehiculo.ID_Marca_Vehiculo);
      }
    });
    this.vehicleQuery.getStatuses().subscribe(({data}) => {
      this.statuses = data;
    });
  }

  public onCancel(): void {
    this.dialogRef.close(true);
  }

  public isFormInvalid(): boolean {
    return Object.keys(this.vehicleForm.controls).some(controlName => {
      const control = this.vehicleForm.controls[controlName];
      return control.errors && control.errors.required && control.value === '';
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.vehicleForm.invalid) {
      return;
    }
    const data = {
      ID_Vehiculo: this.data.vehicle.ID_Vehiculo,
      Placa: this.vehicleForm.controls.plate.value,
      Kilometraje: this.vehicleForm.controls.kms.value,
      Chasis: this.vehicleForm.controls.chasis.value,
      Motor: this.vehicleForm.controls.motor.value,
      KPG: this.vehicleForm.controls.kpg.value,
      Imagen_URL: this.vehicleForm.controls.img.value,
      Anio: this.vehicleForm.controls.year.value,
      Color: this.vehicleForm.controls.color.value,
      ID_Modelo: this.vehicleForm.controls.model.value,
      ID_Estado_Vehiculo: this.vehicleForm.controls.status.value
    };

    let mutationResponse;
    if (this.isCreate) {
      mutationResponse = await this.vehicleMutation.createVehicle(data);
    } else {
      mutationResponse = await this.vehicleMutation.editVehicle(data);
    }

    if (mutationResponse) {
      this.onCancel();
    }
  }

  public filterModels(brandId: number): void {
    this.filteredModels = this.models.filter(model => model.Marca_Vehiculo.ID_Marca_Vehiculo === brandId);
    this.vehicleForm.patchValue({
      model: this.filteredModels[0].ID_Modelo
    });
    this.setType(this.filteredModels[0]);
  }

  public setType(model: IModel): void {
    this.vehicleForm.patchValue({
      vehicleType: model.Tipo_Vehiculo.Tipo_Vehiculo
    });
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
      color: this.data.vehicle.Color,
      model: this.data.vehicle.Modelo.ID_Modelo,
      brand: this.data.vehicle.Modelo.Marca_Vehiculo.ID_Marca_Vehiculo,
      status: this.data.vehicle.Estado_Vehiculo.ID_Estado_Vehiculo,
      vehicleType: this.data.vehicle.Modelo.Tipo_Vehiculo.Tipo_Vehiculo
    });
  }
}
