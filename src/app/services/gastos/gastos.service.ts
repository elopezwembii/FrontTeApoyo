import {Gasto} from '@/interfaces/gastos';
import {Ingreso} from '@/interfaces/ingresos';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GastosService {
    private gastosHormigas = [];

    // Mock Users Data
    gastos: Gasto[] = [];

    constructor(private _http: HttpClient) {}

    private getFecha(i: Gasto) {
        return new Date(`${i.anio}/${i.mes}/${i.dia}`);
    }

    async getGasto(mes: number, anio: number) {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(
                        environment.uri_api +
                            'gastos_variables?mes=' +
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
                            'gastos_fijos?mes=' +
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
            this.gastos = data.concat(data2);
            const sumaTotalReal = this.gastos.reduce((total, gasto) => {
                return total + gasto.monto;
            }, 0);

            return of({gastos: this.gastos, sumaTotalReal});
        } catch (error) {}
    }

    async agregarGasto(gasto: Gasto): Promise<boolean> {

        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'agregar_gasto',
                        {
                            desc: gasto.desc,
                            monto: gasto.monto,
                            fijar: gasto.fijar,
                            tipo_gasto: gasto.tipo_gasto,
                            subtipo_gasto: `${
                                gasto.tipo_gasto
                            }${++gasto.subtipo_gasto}`,
                            dia: gasto.dia,
                            mes: gasto.mes,
                            anio: gasto.anio
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


    async agregarGastoAsociandoAhorro(gasto: Gasto, idAhorro:any): Promise<boolean> {
        
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'agregar_gasto_asociandoAhorro',
                        {
                            desc: gasto.desc,
                            monto: gasto.monto,
                            fijar: gasto.fijar,
                            tipo_gasto: gasto.tipo_gasto,
                            subtipo_gasto: `${
                                gasto.tipo_gasto
                            }${++gasto.subtipo_gasto}`,
                            dia: gasto.dia,
                            mes: gasto.mes,
                            anio: gasto.anio,
                            idAhorro
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


    async actualizarGasto(
        gasto: Gasto,
        mesSelect: number,
        anioSelect: number
    ): Promise<boolean> {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'gasto/' + gasto.id,
                        {
                            desc: gasto.desc,
                            monto: gasto.monto,
                            fijar: gasto.fijar,
                            tipo_gasto: gasto.tipo_gasto,
                            subtipo_gasto: `${
                                gasto.tipo_gasto
                            }${++gasto.subtipo_gasto}`,
                            dia: gasto.dia,
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
            return true;
        } catch (error) {
            return false;
        }
    }

    async eliminarGasto(idToDelete: number) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .delete(
                        environment.uri_api + 'gasto/' + idToDelete,

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

    obtenerGastoHormiga() {
        return of(this.gastos);
    }




    async agregarGastoAsociandoDeuda(gasto: Gasto, idDeuda:any){      

        return this._http
        .post(
            environment.uri_api + 'agregar_gasto_asociandoDeuda',
            {
                desc: gasto.desc,
                monto: gasto.monto,
                fijar: gasto.fijar,
                tipo_gasto: gasto.tipo_gasto,
                subtipo_gasto: `${
                    gasto.tipo_gasto
                }${gasto.subtipo_gasto}`,
                dia: gasto.dia,
                mes: gasto.mes,
                anio: gasto.anio,
                idDeuda
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

    }
}
