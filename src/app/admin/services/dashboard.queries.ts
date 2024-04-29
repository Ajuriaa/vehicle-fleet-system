import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IDashboardQuery } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardQueries {
  constructor(private http: HttpClient) {}

  public dashboardQuery(): Observable<IDashboardQuery> {
    return this.http.get<IDashboardQuery>(`${environment.apiUrl}/dashboard`);
  }
}
