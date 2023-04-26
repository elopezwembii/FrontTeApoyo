import {Categoria, Presupuesto} from '@/interfaces/presupuesto';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PresupuestoService {
    categoria: Categoria[] = [
        {
            id: '1',
            descripcion: 'Hogar',
            img: 'fas fa-home'
        },
        {
            id: '2',
            descripcion: 'Servicios básicos',
            img: 'fas fa-wrench'
        },
        {
            id: '3',
            descripcion: 'Alimento y comida',
            img: 'fas fa-utensils'
        },
        {
            id: '4',
            descripcion: 'Entretenimiento',
            img: 'fas fa-gamepad'
        },
        {
            id: '5',
            descripcion: 'Salud y belleza',
            img: 'fas fa-heart'
        },
        {
            id: '6',
            descripcion: 'Auto y transporte',
            img: 'fas fa-car'
        },
        {
            id: '7',
            descripcion: 'Educación y trabajo',
            img: 'fas fa-graduation-cap'
        },
        {
            id: '8',
            descripcion: 'Regalo y ayudas',
            img: 'fas fa-gift'
        },
        {
            id: '9',
            descripcion: 'Viajes',
            img: 'fas fa-plane'
        },
        {
            id: '10',
            descripcion: 'Créditos',
            img: 'fas fa-credit-card'
        },
        {
            id: '11',
            descripcion: 'Ropa y calzado',
            img: 'fas fa-tshirt'
        },
        {
            id: '12',
            descripcion: 'Personal',
            img: 'fas fa-user'
        },
        {
            id: '13',
            descripcion: 'Compras Online',
            img: 'fas fa-shopping-cart'
        },
        {
            id: '14',
            descripcion: 'Ahorro e inversiones',
            img: 'fas fa-piggy-bank'
        }
    ];

    presupuestos: Presupuesto[] = [
        {
            id: 1,
            categoria: '10',
            mes: 4,
            year: 2023,
            monto: 500000
        },
        {
            id: 2,
            categoria: '2',
            mes: 4,
            year: 2023,
            monto: 300000
        },
        {
            id: 3,
            categoria: '3',
            mes: 4,
            year: 2023,
            monto: 200000
        },
        {
            id: 4,
            categoria: '4',
            mes: 4,
            year: 2023,
            monto: 800000
        },
        {
            id: 5,
            categoria: '5',
            mes: 4,
            year: 2023,
            monto: 350000
        },
        {
            id: 6,
            categoria: '14',
            mes: 4,
            year: 2023,
            monto: 650000
        }
    ];

    presupuestoMensual: any[] = [
        {
            mes: 4,
            anio: 2023,
            presupuesto: 11500000
        },
        {
            mes: 5,
            anio: 2023,
            presupuesto: 11000000
        },
        {
            mes: 6,
            anio: 2023,
            presupuesto: 11100000
        }
    ];

    constructor() {}

    obtenerCategoria = (): Observable<Categoria[]> => {
        return of(this.categoria);
    };

    obtenerPresupuestos = (
        mes: number,
        anio: number
    ): Observable<{presupuestos: Presupuesto[]; total: number}> => {
        return new Observable<{presupuestos: Presupuesto[]; total: number}>(
            (observer) => {
                const presupuestosFiltrados = this.presupuestos.filter(
                    (p) => p.mes === mes && p.year === anio
                );
                const presupuestosConDescripcionCategoria =
                    presupuestosFiltrados.map((p) => {
                        const categoria = this.categoria.find(
                            (c) => c.id === p.categoria
                        );
                        const categoriaId = categoria ? categoria.id : null;
                        const imgCategoria = categoria ? categoria.img : null;
                        return {
                            ...p,
                            categoria: categoria ? categoria.descripcion : '',
                            categoriaId,
                            imgCategoria
                        };
                    });
                const total = presupuestosFiltrados.reduce(
                    (acc, p) => acc + p.monto,
                    0
                );
                observer.next({
                    presupuestos: presupuestosConDescripcionCategoria,
                    total
                });
                observer.complete();
            }
        );
    };

    agregarPresupuesto(nuevoPresupuesto: Presupuesto): Observable<string> {
        return new Observable<string>((observer) => {
            this.presupuestos.push(nuevoPresupuesto);
            observer.next(`Presupuesto agregado correctamente`);
            observer.complete();
        });
    }

    getCategoriaDescripcion(id: string): string {
        const categoriaEncontrada = this.categoria.find((c) => c.id === id);
        return categoriaEncontrada ? categoriaEncontrada.descripcion : '';
    }

    actualizarPresupuesto(
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
    }

    eliminarPresupuesto(presupuestoId: number): Observable<String> {
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
    }

    obtenerDatosGrafico(mes: number, anio: number): Observable<any> {
        const datosGrafico = this.presupuestos
            .filter(
                (presupuesto) =>
                    presupuesto.mes === mes && presupuesto.year === anio
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
    }

    obtenerPresupuestoMensual(mes: number, anio: number): Observable<number> {
        const presupuesto = this.presupuestoMensual.find(
            (presupuesto) =>
                presupuesto.mes === mes && presupuesto.anio === anio
        );
        return of(presupuesto ? presupuesto.presupuesto : 0);
    }
}
