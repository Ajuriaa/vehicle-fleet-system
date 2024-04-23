import { Component, Inject, OnInit } from '@angular/core';
import { FileDropComponent, PrimaryButtonComponent } from 'src/app/shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Upload, VehicleStatus } from 'src/app/core/enums';
import { UploaderService, VehicleMutations, VehicleQueries } from '../../services';
import { IBrand, IModel, IVehicle, IVehicleStatus, IVehicleType } from '../../interfaces';
import { FileUploadControl, FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { FileNameHelper } from '../../helpers';
import { environment } from 'src/environments/environments';

const FILE_BASE_URL = environment.filesUrl;
@Component({
  selector: 'app-create-update-vehicle',
  standalone: true,
  imports: [
    PrimaryButtonComponent, CommonModule,
    FormsModule, ReactiveFormsModule,
    FormsModule, MatInputModule, MatFormFieldModule,
    MatOptionModule, MatSelectModule, FileUploadModule,
    FileDropComponent
  ],
  providers: [VehicleMutations, FileNameHelper],
  templateUrl: './create-update-vehicle.component.html',
  styleUrl: './create-update-vehicle.component.scss'
})
export class CreateUpdateVehicleComponent implements OnInit {
  public isCreate = false;
  public vehicleType = '';
  public currentYear = new Date().getFullYear();
  public vehicleForm!: FormGroup;
  public brands: IBrand[] = [];
  public models: IModel[] = [];
  public filteredModels: IModel[] = [];
  public vehicleTypes: IVehicleType[] = [];
  public statuses: IVehicleStatus[] = [];
  public selectedFile!: File;
  public filesControl = new FileUploadControl(undefined, FileUploadValidators.filesLimit(2));
  public error = false;
  public fileError = false;
  private readonly fileUrl = FILE_BASE_URL;

  constructor(
    private _formBuilder: FormBuilder,
    private vehicleMutation: VehicleMutations,
    private vehicleQuery: VehicleQueries,
    private fileNameHelper: FileNameHelper,
    public dialogRef: MatDialogRef<CreateUpdateVehicleComponent>,
    private uploaderService: UploaderService,
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

  public getFiles(files: File[]): void {
    this.selectedFile = files[0];
  }

  public async onSubmit(): Promise<void> {
    this.error = false;
    this.fileError = false;

    if (this.vehicleForm.invalid) {
      this.error = true;
      return;
    } else if (!this.selectedFile) {
      this.fileError = true;
      return;
    }

    const plate = this.vehicleForm.controls.plate.value;
    const fileName = this.fileNameHelper.getFileName(plate, this.selectedFile);
    console.log(fileName);
    const data = {
      ID_Vehiculo: this.data.vehicle.ID_Vehiculo,
      Placa: this.vehicleForm.controls.plate.value,
      Kilometraje: this.vehicleForm.controls.kms.value,
      Chasis: this.vehicleForm.controls.chasis.value,
      Motor: this.vehicleForm.controls.motor.value,
      KPG: this.vehicleForm.controls.kpg.value,
      Imagen_URL: this.fileUrl + 'vehicles/' + fileName,
      Anio: this.vehicleForm.controls.year.value,
      Color: this.vehicleForm.controls.color.value,
      ID_Modelo: this.vehicleForm.controls.model.value,
      ID_Estado_Vehiculo: this.vehicleForm.controls.status.value
    };

    const fileUploaded = await this.uploaderService.uploadFile(this.selectedFile, Upload.vehicle, fileName);

    if(fileUploaded){
      const mutationResponse = this.isCreate
      ? await this.vehicleMutation.createVehicle(data)
      : await this.vehicleMutation.editVehicle(data);

      if (mutationResponse) {
        this.onCancel();
      }
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
    this.disableFields();
  }

  private disableFields(): void {
    const vehicleState = this.data.vehicle.Estado_Vehiculo.Estado_Vehiculo;
    vehicleState === VehicleStatus.inUse ? this.vehicleForm.controls.status.disable() : '';

    this.vehicleForm.controls.model.disable();
    this.vehicleForm.controls.brand.disable();
    this.vehicleForm.controls.plate.disable();
    this.vehicleForm.controls.kms.disable();
    this.vehicleForm.controls.chasis.disable();
    this.vehicleForm.controls.motor.disable();
    this.vehicleForm.controls.year.disable();
  }
}
