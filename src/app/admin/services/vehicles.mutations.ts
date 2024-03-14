import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';
import { IVehicle } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {}

  public deleteVehicle(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/delete-vehicle`, { id }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Vehículo eliminado correctamente', 'Listo!');
            resolve(response);
          }
          this.toaster.success('Ocurrió un error durante la eliminación', 'Error!');
          resolve(response);
        },
        (error) => {
          this.toaster.error(error, 'Error!');
          reject(error);
        }
      );
    });
  }

  public createVehicle(data: IVehicle): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-vehicle`, data).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Vehículo creado correctamente', 'Listo!');
            resolve(response);
          }
          this.toaster.success('Ocurrió un error durante la creación', 'Error!');
          resolve(response);
        },
        (error) => {
          this.toaster.error(error, 'Error!');
          reject(error);
        }
      );
    });
  }
}
