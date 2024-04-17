import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DashboardQueries {
  constructor(private http: HttpClient) {}

  public test(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/test`);
  }
}
