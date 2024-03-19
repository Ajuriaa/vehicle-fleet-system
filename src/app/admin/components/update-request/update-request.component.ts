import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { PrimaryButtonComponent } from 'src/app/shared';
import { IDriver, IRequest, IRequestStatus, IVehicle } from '../../interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vehicleInfoHelper } from '../../helpers';
import { EMPTY_REQUEST } from 'src/app/core/helpers';
import { RequestMutations, RequestQueries } from '../../services';

@Component({
  selector: 'app-update-request',
  standalone: true,
  imports: [
    PrimaryButtonComponent, FormsModule,
    ReactiveFormsModule, MatInput,
    CommonModule
  ],
  templateUrl: './update-request.component.html',
  styleUrl: './update-request.component.scss'
})
export class UpdateRequestComponent implements OnInit {
  public requestForm!: FormGroup;
  public driverList: IDriver[] = [];
  public vehicleList: IVehicle[] = [];
  public statusList: IRequestStatus[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private vehicleInfoHelper: vehicleInfoHelper,
    private requestQuery: RequestQueries,
    private requestMutations: RequestMutations,
    private dialogRef: MatDialogRef<UpdateRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public request: IRequest = EMPTY_REQUEST
  ){}

  ngOnInit(): void {
    this.requestForm = this._formBuilder.group({
      status: ['', [Validators.required]],
      vehicle: ['', [Validators.required]],
      driver: ['', [Validators.required]],
    });

    this.fetchData();
    this.fillForm();
  }

  public onCancel(): void {
    this.dialogRef.close(true);
  }

  public async onSubmit(): Promise<void> {
    if (this.requestForm.invalid) {
      return;
    }
    const data = {
      ID_Solicitud: this.request.ID_Solicitud,
      ID_Estado_Solicitud: this.requestForm.value.status,
      ID_Vehiculo: this.requestForm.value.vehicle,
      ID_Conductor: this.requestForm.value.driver
    };

    const mutationResponse = await this.requestMutations.updateRequest(data);

    if (mutationResponse) {
      this.onCancel();
    }
  }

  private fillForm(): void {
    this.requestForm.patchValue({
      status: this.request.TB_Estado_Solicitud.Estado,
      vehicle: this.vehicleInfoHelper.getModel(this.request.TB_Vehiculos),
      driver: this.request.TB_Conductores?.Nombre || ''
    });
  }

  private fetchData(): void {
    this.requestQuery.availableForRequest(this.request.ID_Solicitud).subscribe((data) => {
      if(data) {
        this.driverList = data.drivers;
        this.vehicleList = data.vehicles;
        this.statusList = data.states;
      }
    });
  }
}
