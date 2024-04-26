import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IBrandsResponse, IModelResponse, IStatusesReponse, ITypeResponse, IVehicleInfoResponse, IVehicleResponse, IVehiclesResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleQueries {
  constructor(private http: HttpClient) {}

  public getVehicle(id: number): Observable<IVehicleResponse> {
    return this.http.get<IVehicleResponse>(`${environment.apiUrl}/vehicle/${id}`);
  }

  public getVehicleInfo(id: number): Observable<IVehicleInfoResponse> {
    return this.http.get<IVehicleInfoResponse>(`${environment.apiUrl}/vehicle-info/${id}`);
  }

  public getAllVehicles(): Observable<IVehiclesResponse> {
    return this.http.get<IVehiclesResponse>(`${environment.apiUrl}/vehicles`);
  }

  public getModels(): Observable<IModelResponse> {
    return this.http.get<IModelResponse>(`${environment.apiUrl}/vehicle-models`);
  }

  public getBrands(): Observable<IBrandsResponse> {
    return this.http.get<IBrandsResponse>(`${environment.apiUrl}/vehicle-brands`);
  }

  public getStatuses(): Observable<IStatusesReponse> {
    return this.http.get<IStatusesReponse>(`${environment.apiUrl}/vehicle-statuses`);
  }

  public getTypes(): Observable<ITypeResponse> {
    return this.http.get<ITypeResponse>(`${environment.apiUrl}/vehicle-types`);
  }
}
