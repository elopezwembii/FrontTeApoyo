import {Ahorro, TipoAhorro} from '@/interfaces/ahorro';
import {Gasto} from '@/interfaces/gastos';
import { Ingreso } from '@/interfaces/ingresos';
import {
    Component,
    ElementRef,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ModalAhorroComponent} from '@components/modal-ahorro/modal-ahorro.component';
import { ModalAnalisisComponent } from '@components/modal-analisis/modal-analisis.component';
import { Tarjeta } from '@pages/deudas/deudas.component';
import {AhorroService} from '@services/ahorro/ahorro.service';
import { BienService } from '@services/bien.service';
import { DeudasService } from '@services/deudas.service';
import {GastosService} from '@services/gastos/gastos.service';
import { IngresosService } from '@services/ingresos/ingresos.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-bienes',
    templateUrl: './bienes.component.html',
    styleUrls: ['./bienes.component.scss']
})
export class BienesComponent implements OnInit {
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
    apalancamientoCortoTarjetas: number = 0;
    apalancamientoCorto: number = 0;
    apalancamientoLargo: number = 0;
    relacionPat: number = 0;
    sumaValorados: number = 0;
    @ViewChild('modalAnalisis') modalAnalisis: ModalAnalisisComponent;

    vecesRentaCorto: number = -1;
    vecesRentaLargo: number = -1;


    opcionesSelect2 = {
        1: [
            'Un análisis financiero es una evaluación detallada de la situación económica de una empresa o proyecto para entender su estabilidad y rentabilidad. Este proceso incluye la revisión de estados financieros, como el balance general, el estado de resultados y el flujo de caja, que muestran el patrimonio, las ganancias y el movimiento de efectivo. '
        ],
    };

    constructor(
        private ingresoService: IngresosService,
        private deudaService: DeudasService,
        private bienService: BienService
    ) {}

    ngOnInit() {
        this.obtenerData();
    }

    openModal(tipo: number, subtipo: number, indicador: number) {
        this.modalAnalisis.openModal(tipo, subtipo, indicador);
    }

    async obtenerData() {
        this.loading = true;
        this.tarjetas = 0;
        this.creditos = 0;
        this.hipotecarios = 0;
        this.ingresos = 0;
        this.apalancamientoCorto = 0;
        this.apalancamientoLargo = 0;
        this.apalancamientoCortoTarjetas = 0;
        this.relacionPat = 0;
        this.sumaValorados = 0;
    
        // Obtener ingresos
        (
            await this.ingresoService.getIngreso(
                new Date().getMonth() + 1,
                new Date().getFullYear()
            )
        ).subscribe({
            next: ({ingresos}: {ingresos: Ingreso[]}) => {
                ingresos.forEach((ingreso) => {
                    if ([1, 2, 3, 4].includes(ingreso.tipo_ingreso)) {
                        this.ingresos += ingreso.monto_real;
                    }
                });
                this.cargaLargo = [];
            },
            error: (error: any) => {}
        });
    
        // Obtener tarjetas
        (await this.deudaService.getTarjeta()).subscribe({
            next: ({tarjeta}: {tarjeta: Tarjeta[]}) => {
                tarjeta.forEach((t) => {
                    this.tarjetas += (t.total * 3) / 100;
                    this.apalancamientoCortoTarjetas += t.total;
                });
            },
            error: (error: any) => {}
        });
    
        // Obtener bienes
        (await this.bienService.getBien()).subscribe({
            next: ({deuda}: {deuda: any}) => {
                deuda.forEach((bien) => {
                    this.sumaValorados += bien.valorado;
                });
            },
            error: (error: any) => {}
        });
    
        // Obtener deudas
        (await this.deudaService.getDeuda()).subscribe({
            next: ({deuda}: {deuda: any}) => {
                deuda.forEach((d) => {
                    if (d.id_tipo_deuda === 2) {
                        this.hipotecarios += d.pago_mensual;
                        this.apalancamientoLargo += d.deuda_pendiente;
                    } else {
                        this.creditos = d.pago_mensual;
                        this.apalancamientoCorto += d.deuda_pendiente;
                    }
                });
    
                this.relacionPat = this.sumaValorados - (this.apalancamientoLargo + this.apalancamientoCorto);
    
                // Calcular porcentajes
                this.porcentajeCargaLarga = (this.hipotecarios / this.ingresos) * 100;
                this.porcentajeCarga = ((this.tarjetas + this.creditos) / this.ingresos) * 100;
                this.porcentajeTotal = ((this.tarjetas + this.creditos + this.hipotecarios) / this.ingresos) * 100;
    
                this.vecesRentaCorto = this.apalancamientoCorto / this.ingresos || 0;
                this.vecesRentaLargo = this.apalancamientoLargo / this.ingresos || 0;
    
                console.log('relacion pat', this.relacionPat);
                this.loading = false;
            },
            error: (error: any) => {
                this.loading = false;
            }
        });
    }
    
}
