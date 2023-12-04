import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Observable, catchError, map, of, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuscriptoresService {

  tags: any = [];

  constructor(private _http: HttpClient) {}

  public getAlls(): Observable<any> {
    return this._http.get<any>(`${environment.uri_api}suscriptores`, { headers: {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }, responseType: 'json' });
  }

  async agregarPlan(planes: any) {

    let model:any = {
      nombre: planes.nombre,
      precio_mensual: planes.precio_mensual,
      precio_anual: planes.precio_anual
    }

    let headers = {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }

    return this._http.post<any[]>(`${environment.uri_api}addplan`, model, { headers: headers, observe: 'response' })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(error => {
          return throwError(error);
        }),
      );
  }

  async actualizarPlan(planes: any) {

    let model:any = {
      id: planes.id,
      nombre: planes.nombre,
      precio_mensual: planes.precio_mensual,
      precio_anual: planes.precio_anual
    }

    let headers = {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }

    return this._http.post<any[]>(`${environment.uri_api}updateplan`, model, { headers: headers, observe: 'response' })
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
