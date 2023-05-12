import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {DeudasService} from '@services/deudas.service';
import {ToastrService} from 'ngx-toastr';

export interface Tarjeta {
    id?: number;
    total?: number;
    utilizado?: number;
    tipo?: string;
    id_usuario?: number;
    id_banco?: number;
}
@Component({
    selector: 'app-deudas',
    templateUrl: './deudas.component.html',
    styleUrls: ['./deudas.component.scss']
})
export class DeudasComponent implements OnInit {
    deudas = [];
    tarjetas = [];
    dias: number[];
    isEditing: boolean = false;
    isAdding: boolean = false;
    selectedDeuda;
    selectedTarjeta;

    generarDias(mes: number, anio: number) {
        // calcular el número de días del mes
        const diasEnMes = new Date(anio, mes, 0).getDate();
        // generar un array con los días del mes
        this.dias = Array.from({length: diasEnMes}, (_, i) => i + 1);
    }

    bancos = [
        'Banco BBVA',
        'Banco Consorcio',
        'Banco de Chile',
        'Banco Estado',
        'Banco Falabella',
        'Banco Internacional',
        'Banco ITAU',
        'Banco Ripley',
        'Banco Santander',
        'Banco Scotiabank',
        'Banco Security',
        'Banco Bice',
        'Copeuch',
        'Coprbanca',
        'HSBC Bank Chile',
        'Mercado Pago',
        'MUFG Bank LTD',
        'Otros Bancos',
        'Prepago Los Heroes',
        'Prepago Tempo',
        'TAPP Caja los Andes'
    ];

    tipos_deuda = [
        'Crédito de consumo',
        'Crédito hipotecario',
        'Crédito automotriz',
        'Compras a crédito'
    ];

    tipos_tarjeta = ['Línea de crédito', 'Tarjeta de crédito'];

    modal: HTMLElement;
    modal2: HTMLElement;
    loading: boolean = false;

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private fb2: FormBuilder,
        private toastr: ToastrService,
        private deudaService: DeudasService
    ) {}

    ngOnInit() {
        this.generarDias(12, 2023);
        this.obtenerDeuda();
        this.obtenerTarjeta();
    }

    form = this.fb.group({
        id: [''],
        costo_total: [, [Validators.required, Validators.min(0)]],
        deuda_pendiente: [, [Validators.required, Validators.min(0)]],
        cuotas_totales: [, [Validators.required, Validators.min(0)]],
        cuotas_pagadas: [, [Validators.required, Validators.min(0)]],
        pago_mensual: [, [Validators.required, Validators.min(0)]],
        dia_pago: [0, [Validators.required, Validators.min(1)]],
        id_banco: [0, [Validators.required, Validators.min(1)]],
        id_tipo_deuda: [0, [Validators.required, Validators.min(1)]]
    });

    form2 = this.fb2.group({
        id: [0],
        total: [0, [Validators.required, Validators.min(0)]],
        utilizado: [0, [Validators.required, Validators.min(0)]],
        tipo: ['0', [Validators.required]],
        id_banco: [0, [Validators.required, Validators.min(1)]]
    });

    abrirModal(isAdd: boolean, deuda) {
        this.isEditing = !isAdd;
        if (this.isEditing) {
            this.form.patchValue({
                costo_total: deuda.costo_total,
                cuotas_pagadas: deuda.cuotas_pagadas,
                cuotas_totales: deuda.cuotas_totales,
                deuda_pendiente: deuda.deuda_pendiente,
                dia_pago: deuda.dia_pago,
                id: deuda.id,
                id_banco: deuda.id_banco,
                id_tipo_deuda: deuda.id_tipo_deuda,
                pago_mensual: deuda.pago_mensual
            });
        }

        this.modal = document.getElementById('exampleModal');
        this.modal.classList.add('show');
        this.modal.style.display = 'block';
    }

    abrirModal2(isAdd: boolean, tarjeta: Tarjeta) {
        this.isEditing = !isAdd;
        if (this.isEditing) {
            this.form2.patchValue({
                id: tarjeta.id,
                total: tarjeta.total,
                utilizado: tarjeta.utilizado,
                tipo: tarjeta.tipo,
                id_banco: tarjeta.id_banco
            });
        }

        this.modal2 = document.getElementById('exampleModal2');
        this.modal2.classList.add('show');
        this.modal2.style.display = 'block';
    }

    cerrarModal() {
        this.modal.classList.remove('show');
        this.modal.style.display = 'none';
    }

    cerrarModal2() {
        this.modal2.classList.remove('show');
        this.modal2.style.display = 'none';
    }

    async obtenerDeuda() {
        this.loading = true;
        (await this.deudaService.getDeuda()).subscribe({
            next: ({deuda}: {deuda: any}) => {
                this.deudas = deuda;

                this.loading = false;
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    async obtenerTarjeta() {
        this.loading = true;
        (await this.deudaService.getTarjeta()).subscribe({
            next: ({tarjeta}: {tarjeta: any}) => {
                this.tarjetas = tarjeta;
                this.loading = false;
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    async deleteDeuda(deuda: any) {
        if (confirm('¿Estás seguro de eliminar la deuda?')) {
            await this.deudaService.eliminarDeuda(deuda.id);
            this.obtenerDeuda();
            this.toastr.info('Deuda eliminada con éxito.');
        }
    }

    async deleteTarjeta(deuda: Tarjeta) {
        if (confirm('¿Estás seguro de eliminar la tarjeta?')) {
            await this.deudaService.eliminarTarjeta(deuda.id);
            this.obtenerDeuda();
            this.toastr.info('Tarjeta eliminada con éxito.');
        }
    }

    async update() {
        this.loading = true;
        if (!this.isEditing) {
            const addDeuda = {
                costo_total: this.form.value.costo_total!,
                deuda_pendiente: this.form.value.deuda_pendiente!,
                cuotas_totales: this.form.value.cuotas_totales!,
                cuotas_pagadas: this.form.value.cuotas_pagadas!,
                pago_mensual: this.form.value.pago_mensual!,
                dia_pago: this.form.value.dia_pago!,
                id_banco: this.form.value.id_banco!,
                id_tipo_deuda: this.form.value.id_tipo_deuda!
            };
            console.log(addDeuda);
            try {
                const res = await this.deudaService.agregarDeuda(addDeuda);
                this.modal.classList.remove('show');
                this.modal.style.display = 'none';
                if (res) {
                    this.obtenerDeuda();
                    this.toastr.success('Deuda agregada con éxito.');
                } else {
                    this.toastr.error('Error al agregar una nueva deuda.');
                    this.loading = false;
                }
            } catch (error) {}
        } else {
            const edit = {
                id: this.form.value.id!,
                costo_total: this.form.value.costo_total!,
                deuda_pendiente: this.form.value.deuda_pendiente!,
                cuotas_totales: this.form.value.cuotas_totales!,
                cuotas_pagadas: this.form.value.cuotas_pagadas!,
                pago_mensual: this.form.value.pago_mensual!,
                dia_pago: this.form.value.dia_pago!,
                id_banco: this.form.value.id_banco!,
                id_tipo_deuda: this.form.value.id_tipo_deuda!
            };
            try {
                await this.deudaService.editarDeuda(edit);
                this.modal.classList.remove('show');
                this.modal.style.display = 'none';

                this.obtenerDeuda();
                this.toastr.success('Deuda editada con éxito.');
            } catch (error) {}
        }
        // clean up
        this.isEditing = false;
        this.isAdding = false;
        this.form2.reset();
        this.form2.patchValue({
            id_banco: 0,
            tipo: '0'
        });
    }

    async update2() {
        this.loading = true;
        if (!this.isEditing) {
            const addTarjeta = {
                total: this.form2.value.total!,
                utilizado: this.form2.value.utilizado!,
                tipo: this.form2.value.tipo!,
                id_banco: this.form2.value.id_banco!
            };
            try {
                const res = await this.deudaService.agregarTarjeta(addTarjeta);
                this.modal2.classList.remove('show');
                this.modal2.style.display = 'none';
                if (res) {
                    this.obtenerTarjeta();
                    this.toastr.success('Tarjeta agregada con éxito.');
                } else {
                    this.toastr.error('Error al agregar una nueva tarjeta.');
                    this.loading = false;
                }
            } catch (error) {}
        } else {
            const edit = {
                id: this.form2.value.id!,
                total: this.form2.value.total!,
                utilizado: this.form2.value.utilizado!,
                tipo: this.form2.value.tipo!,
                id_banco: this.form2.value.id_banco!
            };
            try {
                await this.deudaService.editarTarjeta(edit);
                this.modal2.classList.remove('show');
                this.modal2.style.display = 'none';

                this.obtenerTarjeta();
                this.toastr.success('Tarjeta editada con éxito.');
            } catch (error) {}
        }
        // clean up
        this.isEditing = false;
        this.isAdding = false;
        this.form2.reset();
        this.form2.patchValue({
            id_banco: 0,
            tipo: '0'
        });
    }
}
