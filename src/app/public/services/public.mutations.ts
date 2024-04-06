import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';
import { IRequest } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PublicMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {}

  public createRequest(data: IRequest): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-request`, data).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Solicitud creada correctamente', 'Listo!');
            resolve(response);
          } else {
            this.toaster.success('Ocurrió un error durante la creación', 'Error!');
            resolve(response);
          }
        },
        (error) => {
          this.toaster.error(error.message, 'Error!');
          reject(error);
        }
      );
    });
  }
}
