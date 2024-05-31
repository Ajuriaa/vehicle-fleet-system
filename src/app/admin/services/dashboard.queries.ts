import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IDashboardQuery } from '../interfaces';
import { cookieHelper } from 'src/app/core/helpers';

@Injectable({
  providedIn: 'root'
})
export class DashboardQueries {
  public username = this.cookieHelper.getUsername();
  constructor(private http: HttpClient, private cookieHelper: cookieHelper) {}

  public dashboardQuery(): Observable<IDashboardQuery> {
    return this.http.get<IDashboardQuery>(`${environment.apiUrl}/dashboard/${this.username}`);
  }
}
