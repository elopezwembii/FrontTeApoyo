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
            id: 1,
            descripcion: 'Ahorro celebraciones',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 2,
            descripcion: 'Ahorro cumpleaños',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 3,
            descripcion: 'Ahorro Educación',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 4,
            descripcion: 'Ahorro fiestas patrias',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 5,
            descripcion: 'Ahorro fin de semana largo',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 6,
            descripcion: 'Ahorro navidad/año nuevo',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 7,
            descripcion: 'Ahorro viajes/vacaciones',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 8,
            descripcion: 'Fondo de emergencia',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 9,
            descripcion: 'Ahorro general (varios)',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 10,
            descripcion: 'Inversiones y Acciones',
            img: 'assets/icons/ahorro1.png'
        }
    ];

    private ahorroHistorial = [
        {
            year: 2018,
            amount: 1200
        },
        {
            year: 2019,
            amount: 1500
        },
        {
            year: 2020,
            amount: 1800
        },
        {
            year: 2021,
            amount: 2000
        }
    ];

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

            return of({ahorros: this.ahorros});
        } catch (error) {}
    }

    eliminarAhorro(ahorro: Ahorro): Observable<boolean> {
        const index = this.ahorros.findIndex((a) => a === ahorro);
        if (index !== -1) {
            this.ahorros.splice(index, 1);
            return of(true);
        }
        return of(false);
    }

    editarAhorro(ahorro: Ahorro): Observable<boolean> {
        const index = this.ahorros.findIndex((a) => a.id === ahorro.id);
        if (index === -1) {
            return of(false);
        }
        this.ahorros[index] = {...this.ahorros[index], ...ahorro};
        return of(true);
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
                            fecha_limite:ahorro.fecha_limite,
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

    obtenerAhorroHistorial() {
        return of(this.ahorroHistorial);
    }

    obtenerTipoAhorro() {
        return of(this.tiposAhorro);
    }

    obtenerNivelAhorroUsuario() {
        return of(this.nivelUsuario);
    }
}
