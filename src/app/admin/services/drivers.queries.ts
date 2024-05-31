import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IDriverResponse, IDriversResponse } from '../interfaces';
import { cookieHelper } from 'src/app/core/helpers';

@Injectable({
  providedIn: 'root'
})
export class DriverQueries {
  public username = this.cookieHelper.getUsername();
  constructor(private http: HttpClient, private cookieHelper: cookieHelper) {}

  public getAllDrivers(): Observable<IDriversResponse> {
    return this.http.get<IDriversResponse>(`${environment.apiUrl}/drivers/${this.username}`);
  }

  public getDriver(id: number): Observable<IDriverResponse> {
    return this.http.get<IDriverResponse>(`${environment.apiUrl}/driver/${id}/${this.username}`);
  }
}
