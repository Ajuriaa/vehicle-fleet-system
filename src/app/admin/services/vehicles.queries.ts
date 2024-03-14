import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IVehicleResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleQueries {
  constructor(private http: HttpClient) {}

  public getAllVehicles(): Observable<IVehicleResponse> {
    return this.http.get<IVehicleResponse>(`${environment.apiUrl}/vehicles`);
  }
}
