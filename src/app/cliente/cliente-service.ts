import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ClienteModel } from './cliente.model';
import { Region } from './region.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly urlApi: string = "";

  constructor(private readonly http: HttpClient,
    private readonly router: Router) {
    this.urlApi = environment.apiUrl + '/api';
  }

  getClientes(): Observable<ClienteModel[]> {
    return this.http.get<ClienteModel[]>(this.urlApi + '/clientes');
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlApi + '/clientes/regiones');
  }

  create(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(`${this.urlApi}/clientes`, cliente).pipe(
      map((response: any) => response.cliente as ClienteModel),
      catchError(e => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        if (e.errors.mensaje) {
          console.log(e.errors.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  getCliente(id: number): Observable<ClienteModel> {
    return this.http.get<ClienteModel>(`${this.urlApi}/cliente/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.erro.mensaje) {
          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  update(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.put<ClienteModel>(`${this.urlApi}/cliente/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApi}/cliente/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }
  
}
