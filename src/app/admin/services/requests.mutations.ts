import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RequestMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {}

  public updateRequest(data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/update-request`, { data }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Solicitud actualizada correctamente', 'Listo!');
            resolve(response);
          } else {
            this.toaster.success('Ocurrió un error', 'Error!');
            resolve(response);
          }
        },
        (error) => {
          this.toaster.error(error, 'Error!');
          reject(error);
        }
      );
    });
  }
}
