import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriverMutations } from '../../services';
import { IDriver, IVehicle } from '../../interfaces';
import { PrimaryButtonComponent } from 'src/app/shared';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-update-driver',
  standalone: true,
  imports: [
    PrimaryButtonComponent, FormsModule,
    ReactiveFormsModule, MatInputModule,
    CommonModule
  ],
  templateUrl: './create-update-driver.component.html',
  styleUrl: './create-update-driver.component.scss'
})
export class CreateUpdateDriverComponent implements OnInit {
  public isCreate = false;
  public driverForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private driverMutation: DriverMutations,
    private dialogRef: MatDialogRef<CreateUpdateDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { driver: IDriver, modalType: string }
  ){}

  ngOnInit(): void {
    this.isCreate = this.data.modalType === 'create';
    this.driverForm = this._formBuilder.group({
      name: ['', [Validators.required]]
    });

    this.fillForm();
  }

  public onCancel(): void {
    this.dialogRef.close(true);
  }

  public async onSubmit(): Promise<void> {
    if (this.driverForm.invalid) {
      return;
    }
    const data = {
      ID_Conductor: this.data.driver.ID_Conductor,
      Nombre: this.driverForm.value.name
    };

    let mutationResponse;
    if (this.isCreate) {
      mutationResponse = await this.driverMutation.createDriver(data);
    } else {
      mutationResponse = await this.driverMutation.editDriver(data);
    }

    if (mutationResponse) {
      this.onCancel();
    }
  }

  public fillForm() {
    if(this.isCreate) {
      return;
    }

    this.driverForm.patchValue({
      name: this.data.driver.Nombre
    });
  }
}
