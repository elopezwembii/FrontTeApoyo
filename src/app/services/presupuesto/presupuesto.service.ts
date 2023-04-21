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
            descripcion: 'Hogar'
        },
        {
            id: '2',
            descripcion: 'Servicios básicos'
        },
        {
            id: '3',
            descripcion: 'Alimento y comida'
        },
        {
            id: '4',
            descripcion: 'Entretenimiento'
        },
        {
            id: '5',
            descripcion: 'Salud y belleza'
        },
        {
            id: '6',
            descripcion: 'Auto y transporte'
        },
        {
            id: '7',
            descripcion: 'Educación y trabajo'
        },
        {
            id: '8',
            descripcion: 'Regalo y ayudas'
        },
        {
            id: '9',
            descripcion: 'Viajes'
        },
        {
            id: '10',
            descripcion: 'Créditos'
        },
        {
            id: '11',
            descripcion: 'Ropa y calzado'
        },
        {
            id: '12',
            descripcion: 'Personal'
        },
        {
            id: '13',
            descripcion: 'Compras Online'
        },
        {
            id: '14',
            descripcion: 'Ahorro e inversiones'
        }
    ];

    presupuestos: Presupuesto[] = [
        {
            id: 1,
            categoria: '10',
            mes: 4,
            year: 2023,
            monto: 500
        },
        {
            id: 2,
            categoria: '2',
            mes: 4,
            year: 2023,
            monto: 300
        },
        {
            id: 3,
            categoria: '3',
            mes: 4,
            year: 2023,
            monto: 200
        },
        {
            id: 4,
            categoria: '4',
            mes: 4,
            year: 2023,
            monto: 800
        },
        {
            id: 5,
            categoria: '5',
            mes: 4,
            year: 2023,
            monto: 350
        }
    ];

    constructor() {}

    obtenerCategoria = (): Observable<Categoria[]> => {
        return of(this.categoria);
    };

    obtenerPresupuestos = (
        mes: number,
        anio: number
    ): Observable<Presupuesto[]> => {
        return new Observable<Presupuesto[]>((observer) => {
            const presupuestosFiltrados = this.presupuestos.filter(
                (p) => p.mes === mes && p.year === anio
            );
            const presupuestosConDescripcionCategoria =
                presupuestosFiltrados.map((p) => {
                    const categoria = this.categoria.find(
                        (c) => c.id === p.categoria
                    );
                    const categoriaId = categoria ? categoria.id : null;
                    return {
                        ...p,
                        categoria: categoria ? categoria.descripcion : '',
                        categoriaId
                    };
                });
            observer.next(presupuestosConDescripcionCategoria);
            observer.complete();
        });
    };

    agregarPresupuesto(nuevoPresupuesto: Presupuesto): Observable<string> {
        return new Observable<string>((observer) => {
            console.log({nuevoPresupuesto});
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
            // Buscar el índice del presupuesto a eliminar en el arreglo
            const index = this.presupuestos.findIndex(p => p.id === presupuestoId);
            
            if (index !== -1) {
                // Eliminar el presupuesto del arreglo
                this.presupuestos.splice(index, 1);
                // Emitir el arreglo actualizado a través del observer
                observer.next(`Presupuesto eliminado correctamente`);
                observer.complete();
            } else {
                // Emitir un error si el presupuesto no se encuentra en el arreglo
                observer.error('Presupuesto no encontrado');
            }
        });
    }
    
}
