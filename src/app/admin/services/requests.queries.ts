import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IAvaliableForRequestResponse, IRequestResponse, IRequestsResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RequestQueries {
  constructor(private http: HttpClient) {}

  public getAllRequests(): Observable<IRequestsResponse> {
    return this.http.get<IRequestsResponse>(`${environment.apiUrl}/requests`);
  }

  public getRequest(id: number): Observable<IRequestResponse> {
    return this.http.get<IRequestResponse>(`${environment.apiUrl}/request/${id}`);
  }

  public availableForRequest(id: number): Observable<IAvaliableForRequestResponse> {
    return this.http.get<IAvaliableForRequestResponse>(`${environment.apiUrl}/available-request/${id}`);
  }
}
