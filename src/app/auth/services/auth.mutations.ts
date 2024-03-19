import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators'; // Import map and catchError from rxjs/operators
import { cookieHelper } from 'src/app/core/helpers';
import { SharedDataService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/core/enums';

const API_URL = 'https://satt.transporte.gob.hn/api_login.php';
const APP_ID = '89b473b3ea9d5b6719c8ee8ce0c247d5';
const MODULE_NUMBER = 3;
const ACTION = 'do-login-web';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginApiUrl = API_URL;
  private appId = APP_ID;
  private module = MODULE_NUMBER;
  private action = ACTION;

  constructor(
    private http: HttpClient,
    private _cookie: cookieHelper,
    private _sharedData: SharedDataService,
    private _toaster: ToastrService
  ) { }

  public login(username: string, password: string) {
    const data = {
      appid: this.appId,
      action: this.action,
      modulo: this.module,
      nombre: username,
      password: password
    };

    return this.http.post<any>(this.loginApiUrl, data).pipe(
      map(data => {
        if (data && data.length >= 2) {
          if (data[0].result !== 1) {
            this._toaster.error('Error', 'Usuario o contraseña incorrectos');
            return false;
          }
          const token = data[1].session_key;
          const user = data[1].usuario;
          this._cookie._setCookie(token, user);

          if(this.isAdmin(data[1].roles)) {
            this._toaster.error('Error', 'No tienes los permisos para ingresar a esta aplicación');
            return false;
          }

          this._sharedData.setRole(+this.getRole(data[1].roles));
          this._sharedData.setPosition(data[1].ID_Area.Cargo);
          this._sharedData.setName(data[1].perfil.Nombre);
          this._toaster.success('Bienvenido', 'Inicio de sesión exitoso');
          return true;
        }
        this._toaster.error('Error', 'Usuario o contraseña incorrectos');
        return false;
      }),
      catchError(error => {
        this._toaster.error('Error', error);
        throw error;
      })
    );
  }

  private getRole(roles: { modulo: string, rol: string }[]): string {
    return roles.find(role => +role.modulo === this.module)?.rol || '0';
  }

  private isAdmin(roles: { modulo: string, rol: string }[]): boolean {
    const role = +this.getRole(roles);
    return role === Role.admin;
  }
}
