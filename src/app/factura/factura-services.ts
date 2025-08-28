import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacturaModel } from './factura.model';
import { Producto } from './producto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaServices {


  private readonly urlApi: string = "";

  constructor(private readonly http: HttpClient) {
    this.urlApi = environment.apiUrl + '/api';
  }

  getFactura(id: number): Observable<FacturaModel> {
    return this.http.get<FacturaModel>(`${this.urlApi}/facturas/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/facturas/${id}`);
  }

  filtrarProductos(term: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlApi}/facturas/filtrar-productos/${term}`);
  }

  create(factura: FacturaModel): Observable<FacturaModel> {
    return this.http.post<FacturaModel>(this.urlApi + '/facturas', factura);
  }

}
