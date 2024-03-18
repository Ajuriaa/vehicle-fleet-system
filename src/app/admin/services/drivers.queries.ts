import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IDriversResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class DriverQueries {
  constructor(private http: HttpClient) {}

  public getAllDrivers(): Observable<IDriversResponse> {
    return this.http.get<IDriversResponse>(`${environment.apiUrl}/drivers`);
  }
}
