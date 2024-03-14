import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';

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
            this.toaster.success('Vehículo eliminado correctamente', '✅ Listo!');
            resolve(true);
          }
        },
        (error) => {
          this.toaster.error(error, '🆘  Error!');
          reject(error);
        }
      );
    });
  }
}
