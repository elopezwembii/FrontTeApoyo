import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Observable, catchError, map, of, throwError} from 'rxjs';
import { Planes } from '@/interfaces/planes';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  tags: any = [];

  constructor(private _http: HttpClient) {}

  public getAlls(): Observable<any> {
    return this._http.get<Planes>(`${environment.uri_api}planes`, { headers: {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }, responseType: 'json' });
  }

  async agregarPlan(model: any) {
 
    let headers = {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }

    return this._http.post<any[]>(`${environment.uri_api}crearPlanes`, model, { headers: headers, observe: 'response' })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(error => {
          return throwError(error);
        }),
      );
  }

  async actualizarPlan(model: Planes) {

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

  public sincronizar(): Observable<any> {
    let go = "plan";
    let headers = {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }
    return this._http.get<any[]>(`${environment.uri_api}sincronizar/${go}`, { headers: headers, observe: 'response' })
      .pipe(
        map((resp: any) => {
          //console.log(resp);
          return resp;
        }),
        catchError(error => {
          return throwError(error);
        }),
      );
  }

  public eliminar(model:any): Observable<any> {
    let headers = {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }
    return this._http.post<any[]>(`${environment.uri_api}eliminar_plan`, model, { headers: headers, observe: 'response' })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(error => {
          return throwError(error);
        }),
      );
  }

  public promoFront(id:any, promo:any): Observable<any> {
    let headers = {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem('user')).access_token
    }
    return this._http.post<any[]>(`${environment.uri_api}promo_front`, {id:id, promo:promo}, { headers: headers, observe: 'response' })
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
