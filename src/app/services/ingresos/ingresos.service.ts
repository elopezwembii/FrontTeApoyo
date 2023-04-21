import {Ingreso} from '@/interfaces/ingresos';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IngresosService {
    ingreso: Ingreso[] = [
        {
            id: 1,
            desc: 'ingreso1',
            fijar: true,
            tipo: 2,
            dia: 19,
            mes: 4,
            anio: 2023,
            montoReal: 100,
            montoPlanificado: 100
        },
        {
            id: 2,
            desc: 'ingreso2',
            fijar: false,
            tipo: 2,
            dia: 12,
            mes: 4,
            anio: 2023,
            montoReal: 300,
            montoPlanificado: 400
        },
        {
            id: 3,
            desc: 'ingreso3',
            fijar: false,
            tipo: 2,
            dia: 7,
            mes: 5,
            anio: 2023,
            montoReal: 500,
            montoPlanificado: 100
        },
        {
            id: 4,
            desc: 'ingreso4',
            fijar: false,
            tipo: 2,
            dia: 12,
            mes: 3,
            anio: 2023,
            montoReal: 50,
            montoPlanificado: 70
        }
    ];

    private getFecha(i: Ingreso) {
        return new Date(`${i.anio}/${i.mes}/${i.dia}`);
    }

    constructor(private _http: HttpClient) {}

    getIngreso(
        fechaInicio: string,
        fechaFin: string
    ): Observable<{ingresos: Ingreso[]; sumaTotalReal: number}> {
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);
        const ingresosFiltrados = this.ingreso.filter((ingreso: Ingreso) => {
            return (
                this.getFecha(ingreso) >= fechaInicioObj &&
                this.getFecha(ingreso) <= fechaFinObj
            );
        });

        const sumaTotalReal = ingresosFiltrados.reduce((total, ingreso) => {
            return total + ingreso.montoReal;
        }, 0);

        return of({ingresos: ingresosFiltrados, sumaTotalReal});
    }

    agregarIngreso(ingreso: Ingreso): Observable<string> {
        console.log('ingreso', ingreso);

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

    eliminarIngreso(idToDelete: number): Observable<string> {
        const index = this.ingreso.findIndex((item) => item.id === idToDelete);

        if (index !== -1) {
            this.ingreso.splice(index, 1);
            return of(`Eliminado!!`);
        } else {
            return of(`Error`);
        }
    }

    sumarMontosPorFecha = (
        fecha: string
    ): Observable<{
        sumaMontoReal: number;
        sumaMontoPlanificado: number;
        sumaMontoRealMesAnterior: number;
        sumaMontoPlanificadoMesAnterior: number;
        nombreMesActual: string;
        nombreMesAnterior: string;
    }> => {
        return new Observable((observer) => {
            const [anio, mes, dia] = fecha.split('/');
            const fechaActual = new Date(
                Number(anio),
                Number(mes) - 1,
                Number(dia)
            );

            const nombreMesActual = new Intl.DateTimeFormat('es-ES', {
                month: 'long'
            }).format(fechaActual);

            const sumaMontoReal = this.ingreso.reduce((acc, ingreso) => {
                if (
                    ingreso.anio.toString() === anio &&
                    ingreso.mes.toString() === mes
                ) {
                    acc += ingreso.montoReal;
                }
                return acc;
            }, 0);
            const sumaMontoPlanificado = this.ingreso.reduce((acc, ingreso) => {
                if (
                    ingreso.anio.toString() === anio &&
                    ingreso.mes.toString() === mes
                ) {
                    acc += ingreso.montoPlanificado;
                }
                return acc;
            }, 0);

            const fechaMesAnterior = new Date(
                fechaActual.getFullYear(),
                fechaActual.getMonth() - 1,
                1
            );
            const anioMesAnterior = fechaMesAnterior.getFullYear().toString();
            const mesMesAnterior = (fechaMesAnterior.getMonth() + 1).toString();
            const nombreMesAnterior = new Intl.DateTimeFormat('es-ES', {
                month: 'long'
            }).format(fechaMesAnterior);

            const sumaMontoRealMesAnterior = this.ingreso.reduce(
                (acc, ingreso) => {
                    if (
                        ingreso.anio.toString() === anioMesAnterior &&
                        ingreso.mes.toString() === mesMesAnterior
                    ) {
                        acc += ingreso.montoReal;
                    }
                    return acc;
                },
                0
            );
            const sumaMontoPlanificadoMesAnterior = this.ingreso.reduce(
                (acc, ingreso) => {
                    if (
                        ingreso.anio.toString() === anioMesAnterior &&
                        ingreso.mes.toString() === mesMesAnterior
                    ) {
                        acc += ingreso.montoPlanificado;
                    }
                    return acc;
                },
                0
            );

            observer.next({
                sumaMontoReal,
                sumaMontoPlanificado,
                sumaMontoRealMesAnterior,
                sumaMontoPlanificadoMesAnterior,
                nombreMesActual,
                nombreMesAnterior
            });
            observer.complete();
        });
    };
}
