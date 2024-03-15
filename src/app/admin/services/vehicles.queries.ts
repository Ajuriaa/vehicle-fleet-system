import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IVehicleResponse, IVehiclesResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleQueries {
  constructor(private http: HttpClient) {}

  public getVehicle(id: number): Observable<IVehicleResponse> {
    return this.http.get<IVehicleResponse>(`${environment.apiUrl}/vehicle/${id}`);
  }

  public getAllVehicles(): Observable<IVehiclesResponse> {
    return this.http.get<IVehiclesResponse>(`${environment.apiUrl}/vehicles`);
  }
}
