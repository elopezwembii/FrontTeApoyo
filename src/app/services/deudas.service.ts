import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Tarjeta} from '@pages/deudas/deudas.component';
import {environment} from 'environments/environment';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeudasService {
    deuda = [];
    tarjeta = [];
    constructor(private _http: HttpClient) {}

    async getDeuda() {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(environment.uri_api + 'obtener_deuda', {
                        headers: {
                            Authorization:
                                'Bearer ' +
                                JSON.parse(sessionStorage.getItem('user'))
                                    .access_token
                        }
                    })
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
            this.deuda = data;

            return of({deuda: this.deuda});
        } catch (error) {}
    }

    async getTarjeta() {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(environment.uri_api + 'obtener_tarjetas', {
                        headers: {
                            Authorization:
                                'Bearer ' +
                                JSON.parse(sessionStorage.getItem('user'))
                                    .access_token
                        }
                    })
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
            this.tarjeta = data;

            return of({tarjeta: this.tarjeta});
        } catch (error) {}
    }

    async agregarDeuda(deuda: any): Promise<boolean> {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'agregar_deuda',
                        {
                            costo_total: deuda.costo_total,
                            deuda_pendiente: deuda.deuda_pendiente,
                            cuotas_totales: deuda.cuotas_totales,
                            cuotas_pagadas: deuda.cuotas_pagadas,
                            pago_mensual: deuda.pago_mensual,
                            dia_pago: deuda.dia_pago,
                            id_banco: deuda.id_banco,
                            id_tipo_deuda: deuda.id_tipo_deuda
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

    async agregarTarjeta(tarjeta: Tarjeta): Promise<boolean> {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'agregar_tarjeta',
                        {
                            total: tarjeta.total,
                            utilizado: tarjeta.utilizado,
                            tipo: tarjeta.tipo,
                            id_banco: tarjeta.id_banco
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

    async eliminarDeuda(idToDelete: number) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .delete(
                        environment.uri_api + 'deuda/' + idToDelete,

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
        } catch (error) {}
    }

    async eliminarTarjeta(idToDelete: number) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .delete(
                        environment.uri_api + 'tarjeta/' + idToDelete,

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
        } catch (error) {}
    }

    async editarDeuda(deuda: any) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'deuda/' + deuda.id,
                        {
                            costo_total: deuda.costo_total,
                            deuda_pendiente: deuda.deuda_pendiente,
                            cuotas_totales: deuda.cuotas_totales,
                            cuotas_pagadas: deuda.cuotas_pagadas,
                            pago_mensual: deuda.pago_mensual,
                            dia_pago: deuda.dia_pago,
                            id_banco: deuda.id_banco,
                            id_tipo_deuda: deuda.id_tipo_deuda
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

    async editarTarjeta(tarjeta: Tarjeta) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'tarjeta/' + tarjeta.id,
                        {
                            total: tarjeta.total,
                            utilizado: tarjeta.utilizado,
                            tipo: tarjeta.tipo,
                            id_banco: tarjeta.id_banco
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
}
