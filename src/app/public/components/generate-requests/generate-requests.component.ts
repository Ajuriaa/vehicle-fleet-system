import { Component, OnInit } from '@angular/core';
import { map, Observable, startWith } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchService } from 'src/app/core/services';
import { NameHelper } from 'src/app/admin/helpers';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PrimaryButtonComponent } from 'src/app/shared';
import { MatSelectModule } from '@angular/material/select';
import { cookieHelper, EMPTY_CITY, EMPTY_REQUEST, EMPTY_USER } from 'src/app/core/helpers';
import { City, Model } from 'src/app/core/enums';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { PublicMutations, PublicQueries } from '../../services';
import { ICity, IRequest, IRequestType, IUser } from '../../interfaces';

@Component({
  selector: 'app-generate-requests',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, MatAutocompleteModule,
    FormsModule, MatCheckboxModule, CommonModule, ReactiveFormsModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, AsyncPipe,
    NgxMaterialTimepickerModule
  ],
  providers: [NameHelper, cookieHelper, provideNativeDateAdapter()],
  templateUrl: './generate-requests.component.html',
  styleUrl: './generate-requests.component.scss'
})
export class GenerateRequestsComponent implements OnInit {
  public cities: ICity[] = [];
  public requestTypes: IRequestType[] = [];
  public employees: IUser[] = [];
  public employee: IUser = EMPTY_USER;
  public filteredEmployees!: Observable<IUser[]>;
  public requestForm!: FormGroup;
  public input = '';
  public id = 0;
  public error = false;
  public noUser = false;
  public showForm = false;
  public selectedEmployees: IUser[] = [];
  public filteredCities!: Observable<ICity[]>;
  public request: IRequest = EMPTY_REQUEST;
  public selectedCity: ICity = EMPTY_CITY;
  public requestCreated = false;

  constructor(
    private formBuilder: FormBuilder,
    private searchEngine: SearchService,
    private publicQuery: PublicQueries,
    private publicMutation: PublicMutations,
    private nameHelper: NameHelper
  ){}

  ngOnInit(): void {
    this.fetchData();
    this.requestForm = this.formBuilder.group({
      city: ['', Validators.required],
      type: ['', Validators.required],
      employees: [''],
      reason: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnTime: ['', Validators.required]
    });
    this.filteredEmployees = this.requestForm.controls.employees.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.employees, value.toString(), Model.user)),
    );
    this.filteredCities = this.requestForm.controls.city.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.cities, value.toString(), Model.city)),
    );
  }

  public isPassengerSelected(user: IUser): boolean {
    return this.selectedEmployees.includes(user);
  }

  public toggleSelection(user: IUser): void {
    if (this.selectedEmployees.includes(user)) {
      const index = this.selectedEmployees.indexOf(user);
      this.selectedEmployees.splice(index, 1);
    } else {
      this.selectedEmployees.push(user);
    }
  }

  public display(): string {
    const names = this.selectedEmployees.map((passenger) => {
      return this.nameHelper.getShortName(passenger.Nombres + " " + passenger.Apellidos);
    });
    return names.join(', ');
  }

  public async onSubmit(): Promise<void> {
    const incompleteForm = this.checkControlsEmpty();

    if (incompleteForm) {
      this.error = true;
      return;
    }

    const data = {
      ID_Solicitud: 0,
      ID_Empleado: this.id,
      Destino: this.requestForm.controls.destination.value,
      Motivo: this.requestForm.controls.reason.value,
      Fecha: this.requestForm.controls.date.value,
      Hora_Salida: moment(this.requestForm.controls.departureTime.value, 'h:mm A').toISOString(),
      Hora_Regreso: moment(this.requestForm.controls.returnTime.value, 'h:mm A').toISOString(),
      Ciudad: this.selectedCity,
      Tipo_Solicitud: this.getRequestType(),
      Pasajeros: this.selectedEmployees.map((passenger) => passenger.ID_Empleado).join(',')
    };

    const mutationResponse = await this.publicMutation.createRequest(data);

    if (mutationResponse) {
      this.requestCreated = true;
    }
  }

  public getId(): void {
    this.error = false;
    this.noUser = false;

    if(this.input === '' || this.input === null) {
      this.error = true;
      return;
    }
    if(this.employees.find(employee => employee.ID_Empleado === +this.input) === undefined ){
      this.noUser = true;
      return;
    }
    this.id = +this.input;
    this.employee = this.employees.find(employee => employee.ID_Empleado === this.id) || EMPTY_USER;
    this.selectedEmployees.push(this.employee);
    this.showForm = true;
    this.error = false;
  }

  public selectCity(city: ICity): void {
    this.selectedCity = city;

    const typeControl = this.requestForm.controls.type;
    this.selectedCity.Nombre === City.TGU ? typeControl.setValue('Interna') : typeControl.setValue('Externa');
  }

  private getRequestType(): IRequestType {
    const type = this.requestForm.controls.type.value;
    return this.requestTypes.find(requestType => requestType.Tipo_Solicitud === type) || this.requestTypes[0];
  }

  private checkControlsEmpty(): boolean {
    return Object.keys(this.requestForm.controls).some(controlName => {
      const control = this.requestForm.controls[controlName];
      return control.errors && control.errors.required && control.value === '';
    });
  }

  private fetchData(): void {
    this.publicQuery.getCities().subscribe(({ data }) => {
      this.cities = data;
    });
    this.publicQuery.getRequestTypes().subscribe(({ data }) => {
      this.requestTypes = data;
    });
    this.publicQuery.getAllUsers().subscribe(({ data }) => {
      this.employees = data;
    });
  }
}
