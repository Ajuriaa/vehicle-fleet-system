import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IRequestsResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RequestQueries {
  constructor(private http: HttpClient) {}

  public getAllRequests(): Observable<IRequestsResponse> {
    return this.http.get<IRequestsResponse>(`${environment.apiUrl}/requests`);
  }
}
