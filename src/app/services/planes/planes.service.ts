import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Observable, catchError, map, of, throwError} from 'rxjs';
import { Planes } from '@/interfaces/planes';

const apiKey = `${environment.api_key}`;
@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  tags: any = [];

  constructor(private _http: HttpClient) {}

  public getAlls(): Observable<any> {
    return this._http.get<Planes>(`${environment.uri_api_v2}/subscriptions`, { headers: {
      Authorization: 'Bearer ' + apiKey
    }, responseType: 'json' });
  }

  async agregarPlan(model: any) {
 
    let headers = {
      Authorization: 'Bearer ' + apiKey
    }

    return this._http.post<any[]>(`${environment.uri_api_v2}/subscriptions`, model, { headers: headers, observe: 'response' })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(error => {
          return throwError(error);
        }),
      );
  }

  async actualizarPlan(model: Planes, planId: number) {

    let headers = {
      Authorization: 'Bearer ' + apiKey
    }
    return this._http.patch<any[]>(`${environment.uri_api_v2}/subscriptions/subscription?subscriptionId=${planId}`, model, { headers: headers, observe: 'response' })
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
      Authorization: 'Bearer ' + apiKey
    }
    return this._http.get<any[]>(`${environment.uri_api_v2}sincronizar/${go}`, { headers: headers, observe: 'response' })
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(error => {
          return throwError(error);
        }),
      );
  }

  public eliminar(id:string): Observable<any> {
    let headers = {
      Authorization: 'Bearer ' + apiKey
    }
    return this._http.delete<any[]>(`${environment.uri_api_v2}/subscriptions/subscription?subscriptionId=${id}`, { headers: headers, observe: 'response' })
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
      Authorization: 'Bearer ' + apiKey
    }
    return this._http.post<any[]>(`${environment.uri_api_v2}promo_front`, {id:id, promo:promo}, { headers: headers, observe: 'response' })
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
