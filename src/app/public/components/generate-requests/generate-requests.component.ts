import { Component, OnInit } from '@angular/core';
import { ICity, IRequest, IRequestType, IUser } from '../../interfaces';
import { EMPTY, map, Observable, startWith } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchService } from 'src/app/core/services';
import { PublicMutations, PublicQueries } from '../../services';
import { NameHelper } from 'src/app/admin/helpers';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PrimaryButtonComponent } from 'src/app/shared';
import { MatSelectModule } from '@angular/material/select';
import { EMPTY_CITY, EMPTY_REQUEST, EMPTY_USER } from 'src/app/core/helpers';
import { Model } from 'src/app/core/enums';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-generate-requests',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, MatAutocompleteModule,
    FormsModule, MatCheckboxModule, CommonModule, ReactiveFormsModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, AsyncPipe,
    NgxMaterialTimepickerModule
  ],
  providers: [NameHelper, provideNativeDateAdapter()],
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
  public showForm = false;
  public selectedEmployees: IUser[] = [];
  public filteredCities!: Observable<ICity[]>;
  public request: IRequest = EMPTY_REQUEST;
  public selectedCity: ICity = EMPTY_CITY;

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
      employees: ['', Validators.required],
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

  public onSubmit(): void {
    true;
  }

  public getId(): void {
    if(this.input === '' || this.input === null) {
      this.error = true;
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
