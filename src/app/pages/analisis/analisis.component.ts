import {Ingreso} from '@/interfaces/ingresos';
import {Component, OnInit} from '@angular/core';
import {Tarjeta} from '@pages/deudas/deudas.component';
import {DeudasService} from '@services/deudas.service';
import {IngresosService} from '@services/ingresos/ingresos.service';

@Component({
    selector: 'app-analisis',
    templateUrl: './analisis.component.html',
    styleUrls: ['./analisis.component.scss']
})
export class AnalisisComponent implements OnInit {
    tarjetas: number = 0;
    creditos: number = 0;
    hipotecarios: number = 0;
    ingresos: number = 0;
    loading: boolean = false;
    cargaCorto: Array<any> = [];
    cargaLargo: Array<any> = [];
    cargaTotal: Array<any> = [];
    porcentajeCarga: number = -1;
    porcentajeCargaLarga: number = -1;
    porcentajeTotal: number = -1;
    apalancamientoCorto: number = 0;
    apalancamientoLargo: number = 0;

    vecesRentaCorto: number = -1;
    vecesRentaLargo: number = -1;

    constructor(
        private ingresoService: IngresosService,
        private deudaService: DeudasService
    ) {}

    ngOnInit() {
        this.obtenerData();
    }

    async obtenerData() {
        this.loading = true;
        //obtener ingresos formales
        (
            await this.ingresoService.getIngreso(
                new Date().getMonth() + 1,
                new Date().getFullYear()
            )
        ).subscribe({
            next: ({ingresos}: {ingresos: Ingreso[]}) => {
                ingresos.forEach((ingreso) => {
                    if (
                        ingreso.tipo_ingreso === 1 ||
                        ingreso.tipo_ingreso === 2 ||
                        ingreso.tipo_ingreso === 3 ||
                        ingreso.tipo_ingreso === 4
                    ) {
                        this.ingresos += ingreso.monto_real;
                    }
                });
                this.cargaCorto = [{name: 'Ingresos', value: this.ingresos}];
                this.cargaLargo = [{name: 'Ingresos', value: this.ingresos}];
            },
            error: (error: any) => {
                console.log(error);
            }
        });
        //obtener tarjetas
        (await this.deudaService.getTarjeta()).subscribe({
            next: ({tarjeta}: {tarjeta: Tarjeta[]}) => {
                tarjeta.forEach((t) => {
                    this.tarjetas += (t.total * 3) / 100;
                    this.apalancamientoCorto += t.total;
                });
                this.cargaCorto = [
                    ...this.cargaCorto,
                    {name: 'Tarjetas', value: this.tarjetas}
                ];
            },
            error: (error: any) => {}
        });
        //obtener deudas
        (await this.deudaService.getDeuda()).subscribe({
            next: ({deuda}: {deuda: any}) => {
                console.log(deuda);
                deuda.forEach((d) => {
                    if (d.id_tipo_deuda === 2) {
                        this.hipotecarios += d.pago_mensual;
                        this.apalancamientoLargo += d.deuda_pendiente;
                    } else {
                        this.creditos = d.pago_mensual;
                        this.apalancamientoCorto += d.deuda_pendiente;
                    }
                });
                this.cargaCorto = [
                    ...this.cargaCorto,
                    {name: 'Créditos a corto plazo', value: this.creditos}
                ];
                this.cargaLargo = [
                    ...this.cargaLargo,
                    {name: 'Créditos hipotecarios', value: this.hipotecarios}
                ];
                this.cargaTotal = [
                    {name: 'Ingresos', value: this.ingresos},
                    {name: 'Tarjetas', value: this.tarjetas},
                    {name: 'Créditos a corto plazo', value: this.creditos},
                    {name: 'Créditos hipotecarios', value: this.hipotecarios}
                ];
            },
            error: (error: any) => {}
        });

        this.porcentajeCargaLarga = (this.hipotecarios / this.ingresos) * 100;
        this.porcentajeCarga =
            ((this.tarjetas + this.creditos) / this.ingresos) * 100;
        this.porcentajeTotal =
            ((this.tarjetas + this.creditos + this.hipotecarios) /
                this.ingresos) *
            100;

        this.vecesRentaCorto = (this.ingresos) / this.apalancamientoCorto;
        this.vecesRentaLargo = (this.ingresos) / this.apalancamientoLargo;


        this.loading = false;
    }
}
