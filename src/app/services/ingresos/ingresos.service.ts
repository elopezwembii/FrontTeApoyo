import {SIDEBAR_DARK_SKINS} from './../../utils/themes';
import {Ingreso} from '@/interfaces/ingresos';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IngresosService {
    ingreso: Ingreso[] = [];

    private getFecha(i: Ingreso) {
        return new Date(`${i.anio}/${i.mes}/${i.dia}`);
    }

    constructor(private _http: HttpClient) {}

    async getIngreso(mes: number, anio: number) {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(
                        environment.uri_api +
                            'ingresos_variables?mes=' +
                            mes +
                            '&anio=' +
                            anio,
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            const data2: any = await new Promise((resolve, reject) => {
                this._http
                    .get(
                        environment.uri_api +
                            'ingresos_fijos?mes=' +
                            mes +
                            '&anio=' +
                            anio,
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            this.ingreso = data.concat(data2);
            const sumaTotalReal = this.ingreso.reduce((total, ingreso) => {
                return total + ingreso.monto_real;
            }, 0);

            return of({ingresos: this.ingreso, sumaTotalReal});
        } catch (error) {}
    }

    async agregarIngreso(ingreso: Ingreso): Promise<boolean> {
        console.log(ingreso);
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'agregar_ingreso',
                        {
                            desc: ingreso.desc,
                            montoReal: ingreso.monto_real,
                            fijar: ingreso.fijar,
                            tipo: ingreso.tipo_ingreso,
                            dia: ingreso.dia,
                            mes: ingreso.mes,
                            anio: ingreso.anio
                        },
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async actualizarIngreso(
        ingreso: Ingreso,
        mesSelect: number,
        anioSelect: number
    ) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'ingreso/' + ingreso.id,
                        {
                            desc: ingreso.desc,
                            montoReal: ingreso.monto_real,
                            fijar: ingreso.fijar,
                            tipo: ingreso.tipo_ingreso,
                            dia: ingreso.dia,
                            mesSelect: mesSelect,
                            anioSelect: anioSelect
                        },
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            console.log(res);
        } catch (error) {}
    }

    async eliminarIngreso(idToDelete: number) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .delete(
                        environment.uri_api + 'ingreso/' + idToDelete,

                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            console.log(res);
        } catch (error) {}
    }

    async sumaMontoActual(mes: number, anio: number) {
        try {
            const responseVariable: any = await new Promise(
                (resolve, reject) => {
                    this._http
                        .get(
                            environment.uri_api +
                                'total_variable?mes=' +
                                mes +
                                '&anio=' +
                                anio,
                            {
                                headers: {
                                    Authorization:
                                        'Bearer ' +
                                        JSON.parse(
                                            sessionStorage.getItem('user')
                                        ).access_token
                                }
                            }
                        )
                        .subscribe(
                            (response) => {
                                resolve(response);
                            },
                            (error) => {
                                console.error(error);
                                reject(error);
                            }
                        );
                }
            );

            const responseFijo: any = await new Promise((resolve, reject) => {
                this._http
                    .get(
                        environment.uri_api +
                            'total_fijo?mes=' +
                            mes +
                            '&anio=' +
                            anio,
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            return of({
                totalVariableActual: responseVariable,
                totalVariableFijo: responseFijo
            });
        } catch (error) {}
    }

    validaTieneIngreso() {
        return this._http.get(environment.uri_api + 'validaSiTieneIngreso', {
            headers: {
                Authorization:
                    'Bearer ' +
                    JSON.parse(sessionStorage.getItem('user')).access_token
            }
        });
    }
}
