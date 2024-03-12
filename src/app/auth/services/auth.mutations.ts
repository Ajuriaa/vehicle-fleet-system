import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://satt.transporte.gob.hn/api_login.php';
const MODULE_ID = 10;
const ACTION = 'do-login-web';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginApiUrl = API_URL;
  private module = MODULE_ID.toString();
  private action = ACTION;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = new FormData();
    body.append('action', this.action);
    body.append('modulo', this.module);
    body.append('nombre', username);
    body.append('password', password);

    return this.http.post<any>(this.loginApiUrl, body);
  }
}
