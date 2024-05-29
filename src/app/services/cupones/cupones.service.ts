import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Observable, catchError, map, of, throwError} from 'rxjs';
import { Cupones } from '@/interfaces/cupones';

@Injectable({
  providedIn: 'root'
})
export class CuponesService {

  tags: any = [];

  constructor(private _http: HttpClient) {}

  public getAlls(): Observable<any> {
    return this._http.get<Cupones>(`${environment.uri_api}cupones`, { headers: {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }, responseType: 'json' });
  }

  async agregarPromoCupon(cupones: Cupones) {

    let model:any = {
      codigo: cupones.codigo,
      descripcion: cupones.descripcion,
      descuento: cupones.descuento,
      fecha_inicio: cupones.fecha_inicio,
      fecha_fin: cupones.fecha_fin,
      tipo: cupones.tipo
    }

    let headers = {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }

    return this._http.post<any[]>(`${environment.uri_api}promo_cupones`, model, { headers: headers, observe: 'response' })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(error => {
          return throwError(error);
        }),
      );
  }

  async actualizarPromoCupon(cupones: Cupones) {

    let model:any = {
      id: cupones.id,
      codigo: cupones.codigo,
      descripcion: cupones.descripcion,
      descuento: cupones.descuento,
      fecha_inicio: cupones.fecha_inicio,
      fecha_fin: cupones.fecha_fin,
      tipo: cupones.tipo
    }

    let headers = {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }

    return this._http.post<any[]>(`${environment.uri_api}edit_cupones`, model, { headers: headers, observe: 'response' })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(error => {
          return throwError(error);
        }),
      );
  }

}
