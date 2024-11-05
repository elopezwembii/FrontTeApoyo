import {Ahorro, TipoAhorro} from '@/interfaces/ahorro';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AhorroService {
    private tiposAhorro: TipoAhorro[] = [
        {
            id: 0,
            descripcion: 'Ahorro celebraciones',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 1,
            descripcion: 'Ahorro cumpleaños',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 2,
            descripcion: 'Ahorro Educación',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 3,
            descripcion: 'Ahorro fiestas patrias',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 4,
            descripcion: 'Ahorro fin de semana largo',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 5,
            descripcion: 'Ahorro navidad/año nuevo',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 6,
            descripcion: 'Ahorro viajes/vacaciones',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 7,
            descripcion: 'Fondo de emergencia',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 8,
            descripcion: 'Ahorro general (varios)',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 9,
            descripcion: 'Inversiones y Acciones',
            img: 'assets/icons/ahorro1.png'
        }
    ];

    private ahorroHistorial = [];

    private ahorros: Ahorro[] = [];

    private nivelUsuario: any = {
        posibleAhorro: 85000,
        nivel: 'Money Wizard',
        siguienteNivel: 'Budget Boss',
        ahorroSiguienteNivel: 100000
    };
    constructor(private _http: HttpClient) {}

    async obtenerAhorros() {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(environment.uri_api + 'obtener_ahorro', {
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
            this.ahorros = data;
            this.ahorros.forEach((ahorro) => {
                const year = new Date(ahorro.fecha_limite).getFullYear();
                const month = new Date(ahorro.fecha_limite).getMonth();
                const amount = ahorro.recaudado;

                // Verificar si ya existe un objeto en el acumulador con la misma fecha
                const objetoExistente = this.ahorroHistorial.find(
                    (objeto) => objeto.year === year
                );

                if (objetoExistente) {
                    objetoExistente.amount += amount;
                } else {
                    const nuevoObjeto = {year, month, amount};
                    this.ahorroHistorial.push(nuevoObjeto);
                }
            });
            return of({ahorros: this.ahorros, historial: this.ahorroHistorial});
        } catch (error) {}
    }

    async getAhorros(user: any) {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(environment.uri_api_v2 + `/savings?user=${user}`, {
                        headers: {
                            Authorization:
                                'Bearer ' +
                                'TAPY-259be469-9123-42be-b32e-0189999e43eb'
                        }
                    })
                    .subscribe({
                        next: (response) => resolve(response),
                        error: (error) => reject(error)
                    });
            });
            return data;
        } catch (error) {
            console.error("Error en getAhorros:", error);
            throw error;
        }
    }
    

    async eliminarAhorro(ahorro: Ahorro) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .delete(
                        environment.uri_api + 'ahorro/' + ahorro.id,

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

    async editarAhorro(ahorro: Ahorro) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'ahorro/' + ahorro.id,
                        {
                            meta: ahorro.meta,
                            recaudado: ahorro.recaudado,
                            fecha_limite: ahorro.fecha_limite,
                            tipo_ahorro: ahorro.tipo_ahorro.id
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

    async agregarAhorro(ahorro: Ahorro) {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'agregar_ahorro',
                        {
                            meta: ahorro.meta,
                            recaudado: ahorro.recaudado,
                            fecha_limite: ahorro.fecha_limite,
                            tipo_ahorro: ahorro.tipo_ahorro.id
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

    async obtenerAhorroHistorial() {
        return of(this.ahorroHistorial);
    }

    obtenerTipoAhorro() {
        return of(this.tiposAhorro);
    }

    obtenerNivelAhorroUsuario() {
        return of(this.nivelUsuario);
    }

    actualizarMontoAhorro(id, monto) {
        return this._http.put(
            `${environment.uri_api}ahorro/${id}/actualizar-monto`,
            {
                recaudado: monto
            },
            {
                headers: {
                    Authorization:
                        'Bearer ' +
                        JSON.parse(sessionStorage.getItem('user')).access_token
                }
            }
        );
    }
}
