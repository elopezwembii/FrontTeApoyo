import {
    Categoria,
    ItemPresupuesto,
    Presupuesto
} from '@/interfaces/presupuesto';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable, of} from 'rxjs';
import { ReplicateAll, ReplicateOnly } from './interfaces/presupuesto.interface';

const apiKey = `${environment.api_key}`;

@Injectable({
    providedIn: 'root'
})
export class PresupuestoService {
    private categoria: Categoria[] = [
        {
            id: 1,
            descripcion: 'Hogar',
            img: 'fas fa-home'
        },
        {
            id: 2,
            descripcion: 'Servicios básicos',
            img: 'fas fa-wrench'
        },
        {
            id: 3,
            descripcion: 'Alimento y comida',
            img: 'fas fa-utensils'
        },
        {
            id: 4,
            descripcion: 'Entretenimiento',
            img: 'fas fa-gamepad'
        },
        {
            id: 5,
            descripcion: 'Salud y belleza',
            img: 'fas fa-heart'
        },
        {
            id: 6,
            descripcion: 'Auto y transporte',
            img: 'fas fa-car'
        },
        {
            id: 7,
            descripcion: 'Educación y trabajo',
            img: 'fas fa-graduation-cap'
        },
        {
            id: 8,
            descripcion: 'Regalo y ayudas',
            img: 'fas fa-gift'
        },
        {
            id: 9,
            descripcion: 'Viajes',
            img: 'fas fa-plane'
        },
        {
            id: 10,
            descripcion: 'Créditos',
            img: 'fas fa-credit-card'
        },
        {
            id: 11,
            descripcion: 'Ropa y calzado',
            img: 'fas fa-tshirt'
        },
        {
            id: 12,
            descripcion: 'Personal',
            img: 'fas fa-user'
        },
        {
            id: 13,
            descripcion: 'Compras Online',
            img: 'fas fa-shopping-cart'
        },
        {
            id: 14,
            descripcion: 'Ahorro e inversiones',
            img: 'fas fa-piggy-bank'
        }
    ];

    presupuestoMensual: Presupuesto = {} as Presupuesto;

    constructor(private _http: HttpClient) {}

    obtenerCategoria = (): Observable<Categoria[]> => {
        return of(this.categoria);
    };

    async getPresupuesto(mes: number, anio: number) {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(
                        environment.uri_api +
                            'presupuesto_por_mes?mes=' +
                            mes +
                            '&anio=' +
                            anio +
                            '&id_usuario=' +
                            JSON.parse(sessionStorage.getItem('user')).user.id,
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
            this.presupuestoMensual = data.presupuesto[0];
            this.presupuestoMensual.presupuesto = data.ingreso;
            return of({presupuesto: this.presupuestoMensual});
        } catch (error) {}
    }

    async agregarPresupuesto(
        itemPresupuesto: ItemPresupuesto
    ): Promise<boolean> {
        console.log(itemPresupuesto);
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'agregar_item_presupuesto',
                        {
                            tipo_gasto: itemPresupuesto.tipo_gasto,
                            monto: itemPresupuesto.monto,
                            id_presupuesto: itemPresupuesto.id_presupuesto
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

    async replicarPresupuesto(
        data: ReplicateAll
    ): Promise<boolean> {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api_v2 +
                            '/budgets/replicate-all',
                        
                            data
                        ,
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    apiKey
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

    async replicarUnPresupuesto(
        data: ReplicateOnly
    ): Promise<boolean> {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api_v2 +
                            '/budgets/replicate-only',
                        
                            data
                        ,
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    apiKey
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


    /* agregarPresupuesto(nuevoPresupuesto: Presupuesto): Observable<string> {
        return new Observable<string>((observer) => {
            this.presupuestos.push(nuevoPresupuesto);
            observer.next(`Presupuesto agregado correctamente`);
            observer.complete();
        });
    } */

    getCategoriaDescripcion(id: number): string {
        const categoriaEncontrada = this.categoria.find((c) => c.id === id);
        return categoriaEncontrada ? categoriaEncontrada.descripcion : '';
    }

    /* actualizarPresupuesto(
        presupuestoActualizado: Presupuesto
    ): Observable<string> {
        return new Observable<string>((observer) => {
            const index = this.presupuestos.findIndex(
                (p) => p.id === presupuestoActualizado.id
            );

            if (index !== -1) {
                this.presupuestos[index] = presupuestoActualizado;
                observer.next(`Presupuesto agregado correctamente`);
                observer.complete();
            } else {
                observer.error('Presupuesto no encontrado');
            }
        });
    } */

    /* eliminarPresupuesto(presupuestoId: number): Observable<String> {
        return new Observable<String>((observer) => {
            const index = this.presupuestos.findIndex(
                (p) => p.id === presupuestoId
            );

            if (index !== -1) {
                this.presupuestos.splice(index, 1);

                observer.next(`Presupuesto eliminado correctamente`);
                observer.complete();
            } else {
                observer.error('Presupuesto no encontrado');
            }
        });
    } */

    async eliminarItem(idToDelete: number) {
      try {
          const res = await new Promise((resolve, reject) => {
              this._http
                  .delete(
                      environment.uri_api + 'item_presupuesto/' + idToDelete,
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

    /* obtenerDatosGrafico(mes: number, anio: number): Observable<any> {
        const datosGrafico = this.presupuestoMensual
            .filter(
                (presupuesto) =>
                    presupuesto.mes === mes && presupuesto.anio === anio
            )
            .map((presupuesto) => {
                const categoria = this.categoria.find(
                    (categoria) => categoria.id === presupuesto.categoria
                );
                return {
                    name: categoria ? categoria.descripcion : 'Desconocido',
                    value: presupuesto.monto
                };
            });
        return of(datosGrafico);
    } */

    /* obtenerPresupuestoMensual(mes: number, anio: number): Observable<number> {
        const presupuesto = this.presupuestoMensual.find(
            (presupuesto) =>
                presupuesto.mes === mes && presupuesto.anio === anio
        );
        return of(presupuesto ? presupuesto.presupuesto : 0);
    } */



    validaTienePresupuesto() {
        return this._http.get(environment.uri_api + 'validaSiTienePresupuesto', {
            headers: {
                Authorization:
                    'Bearer ' +
                    JSON.parse(sessionStorage.getItem('user')).access_token
            }
        });
    }
}
