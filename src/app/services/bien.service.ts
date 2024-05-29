import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BienService {
    deuda = [];
    tarjeta = [];
    constructor(private _http: HttpClient) {}

    async getBien() {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(environment.uri_api + 'obtener_bien', {
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
            console.log(data);

            return of({deuda: this.deuda});
        } catch (error) {}
    }

    async agregarDeuda(bien: any): Promise<boolean> {
        console.log(bien);
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'agregar_bien',
                        {
                            desc: bien.desc,
                            valorado: bien.valorado,
                            tipo_valorizacion: bien.tipo_valorizacion,
                            tipo_bien: bien.tipo_bien
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
                        environment.uri_api + 'bien/' + idToDelete,

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

    async editarDeuda(bien: any) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'bien/' + bien.id,
                        {
                            desc: bien.desc,
                            valorado: bien.valorado,
                            tipo_valorizacion: bien.tipo_valorizacion,
                            tipo_bien: bien.tipo_bien
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
