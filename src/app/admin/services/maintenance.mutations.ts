import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {}

  public createMaintenance(data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-maintenance`, data).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Mantenimiento agregado correctamente', 'Listo!');
            resolve(response);
          } else {
            this.toaster.success('Ocurrió un error', 'Error!');
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
