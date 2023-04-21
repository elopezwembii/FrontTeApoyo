import {Gasto} from '@/interfaces/gastos';
import {Ingreso} from '@/interfaces/ingresos';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GastosService {
    // Mock Users Data
    gastos: Gasto[] = [
        {
            id: 1,
            desc: 'Gasto1',
            recurrente: false,
            tipo: 2,
            subtipo: 1,
            dia: 2,
            mes: 4,
            anio: 2023,
            monto: 120000
        },
        {
            id: 2,
            desc: 'Gasto2',
            recurrente: true,
            tipo: 3,
            subtipo: 3,
            dia: 5,
            mes: 5,
            anio: 2023,
            monto: 150000
        }
    ];

    constructor() {}

    private getFecha(i: Gasto) {
        return new Date(`${i.anio}/${i.mes}/${i.dia}`);
    }

    getGasto(
        fechaInicio: string,
        fechaFin: string
    ): Observable<{gastos: Gasto[]; sumaTotalReal: number}> {
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);
        const gastosFiltrados = this.gastos.filter((gasto: Gasto) => {
            return (
                this.getFecha(gasto) >= fechaInicioObj &&
                this.getFecha(gasto) <= fechaFinObj
            );
        });

        const sumaTotalReal = gastosFiltrados.reduce((total, gasto) => {
            return total + gasto.monto;
        }, 0);

        return of({gastos: gastosFiltrados, sumaTotalReal});
    }

    agregarGasto(gasto: Gasto): Observable<string> {
        return new Observable((observer) => {
            setTimeout(() => {
                //  const exito = Math.random() > 0.5;

                if (true) {
                    this.gastos.push(gasto);
                    observer.next(
                        `Ingreso con ${gasto.id}  agregado exitosamente`
                    );
                    observer.complete();
                } else {
                    observer.error(`Error al actualizar el servicio con ID`);
                }
            }, 2000);
        });
    }

    actualizarGasto({
        id,
        desc,
        dia,
        monto,
        recurrente,
        tipo,
        subtipo
    }: Gasto): Observable<string> {
        const gastoIndex = this.gastos.findIndex(
            (gasto) => gasto.id === id
        );

        if (gastoIndex !== -1) {
            this.gastos[gastoIndex].desc = desc;
            this.gastos[gastoIndex].dia = dia;
            this.gastos[gastoIndex].monto = monto;
            this.gastos[gastoIndex].recurrente = recurrente;
            this.gastos[gastoIndex].tipo = tipo;
            this.gastos[gastoIndex].subtipo = subtipo;
            return of(`Gasto con ID ${id} actualizado exitosamente`);
        } else {
            return of(`Error al actualizar el Gasto con ID ${id}`);
        }
    }
}
