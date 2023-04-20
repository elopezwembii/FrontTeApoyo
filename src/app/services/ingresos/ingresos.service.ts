import {Ingreso} from '@/interfaces/ingresos';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IngresosService {
    private tipoGasto: any[] = [
        {
            id: 1,
            nombre: 'Fijos'
        },
        {
            id: 2,
            nombre: 'No-fijos'
        },
        {
            id: 3,
            nombre: 'Variable'
        }
    ];

    ingreso: Ingreso[] = [
        {
            id: 1,
            desc: 'ingreso1',
            fijar: true,
            tipo: 2,
            dia: 19,
            mes: 4,
            anio: 2023,
            montoReal: 1300000,
            montoPlanificado: 1300000
        },
        {
            id: 2,
            desc: 'ingreso2',
            fijar: false,
            tipo: 2,
            dia: 12,
            mes: 4,
            anio: 2023,
            montoReal: 300000,
            montoPlanificado: 5000000
        },
        {
            id: 3,
            desc: 'ingreso3',
            fijar: false,
            tipo: 2,
            dia: 7,
            mes: 5,
            anio: 2023,
            montoReal: 300000,
            montoPlanificado: 5000000
        }
    ];

    private getFecha(i: Ingreso) {
        return new Date(`${i.anio}/${i.mes}/${i.dia}`);
    }

    constructor(private _http: HttpClient) {}

    getIngreso(
        fechaInicio: string,
        fechaFin: string
    ): Observable<{ingresos: Ingreso[]; sumaTotal: number}> {
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);
        const ingresosFiltrados = this.ingreso.filter((ingreso: Ingreso) => {
            return (
                this.getFecha(ingreso) >= fechaInicioObj &&
                this.getFecha(ingreso) <= fechaFinObj
            );
        });

        const sumaTotal = ingresosFiltrados.reduce((total, ingreso) => {
            return total + ingreso.montoReal;
        }, 0);

        return of({ingresos: ingresosFiltrados, sumaTotal});
    }

    agregarIngreso(ingreso: Ingreso): Observable<string> {
      console.log('ingreso',ingreso);
      
        return new Observable((observer) => {
            setTimeout(() => {
                //  const exito = Math.random() > 0.5;

                if (true) {
                    this.ingreso.push(ingreso);
                    observer.next(
                        `Ingreso con ${ingreso.id}  agregado exitosamente`
                    );
                    observer.complete();
                } else {
                    observer.error(`Error al actualizar el servicio con ID`);
                }
            }, 2000);
        });
    }

    actualizarIngreso({
        id,
        montoReal,
        montoPlanificado,
        dia
    }: Ingreso): Observable<string> {
        const ingresoIndex = this.ingreso.findIndex(
            (ingreso) => ingreso.id === id
        );

        if (ingresoIndex !== -1) {
            this.ingreso[ingresoIndex].montoReal = montoReal;
            this.ingreso[ingresoIndex].montoPlanificado = montoPlanificado;
            this.ingreso[ingresoIndex].dia = dia;
            return of(`Gasto con ID ${id} actualizado exitosamente`);
        } else {
            return of(`Error al actualizar el Gasto con ID ${id}`);
        }
    }
}
