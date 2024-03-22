import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { ILogResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogsQueries {
  constructor(private http: HttpClient) {}

  public getVehicleLogs(vehicleId: number): Observable<ILogResponse> {
    return this.http.get<ILogResponse>(`${environment.apiUrl}/logs/${vehicleId}`);
  }
}
