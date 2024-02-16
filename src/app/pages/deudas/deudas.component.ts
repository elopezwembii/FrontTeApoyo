import {Gasto} from '@/interfaces/gastos';
import {Ingreso} from '@/interfaces/ingresos';
import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {DeudasService} from '@services/deudas.service';
import {GastosService} from '@services/gastos/gastos.service';
import {IngresosService} from '@services/ingresos/ingresos.service';
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
    selectedValorCuota: number;

    selectedTipoDeuda: number;
    selectedTipoDeudaNombre: string;
    selectedTipoDeudaId: string;

    deudas = [];
    tarjetas = [];
    dias: number[];
    isEditing: boolean = false;
    isAdding: boolean = false;
    selectedDeuda;
    selectedTarjeta;
    sumaTotalReal: number = 0;
    sumaTotalPagoMensual: number = 0;

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
        // 'Crédito de consumo',
        // 'Crédito hipotecario',
        // 'Crédito automotriz',
        // 'Compras a crédito'
        'Créditos de consumo',
        'Crédito hipotecario',
        'Casas comerciales',
        'Crédito automotriz',
        'Tarjeta de crédito',
        'Línea de crédito',
        'Otros pagos de créditos'
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
        private deudaService: DeudasService,
        private ingresoService: IngresosService,
        private gastoService: GastosService
    ) {}

    ngOnInit() {
        this.sumaTotalReal = 0;
        this.sumaTotalPagoMensual = 0;
        this.generarDias(12, 2023); //TODO: Ojo: revisar
        this.obtenerIngresos();
        this.obtenerDeuda();
        this.obtenerTarjeta();

        this.setDiasDelMesActual();
    }

    form = this.fb.group({
        id: [''],
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

    cerrarModal3() {
        // this.modal.classList.remove('show');
        // this.modal.style.display = 'none';

        const modal = document.getElementById('exampleModal');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('show');

        // Elimina TODOS los fondos oscuros (backdrops)
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((backdrop) => {
            document.body.removeChild(backdrop);
        });

        // Restaurar el scroll en el body si es necesario
        document.body.style.paddingRight = '0';
        document.body.classList.remove('modal-open');
    }

    cerrarModal() {
        // this.modal.classList.remove('show');
        // this.modal.style.display = 'none';

        const modal = document.getElementById('modalRegistroDeudaEfectuado');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('show');

        // Elimina TODOS los fondos oscuros (backdrops)
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((backdrop) => {
            document.body.removeChild(backdrop);
        });

        // Restaurar el scroll en el body si es necesario
        document.body.style.paddingRight = '0';
        document.body.classList.remove('modal-open');
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
                deuda.forEach((pago) => {
                    this.sumaTotalPagoMensual += pago.pago_mensual;
                });
                this.loading = false;
            },
            error: (error: any) => {}
        });
    }

    async obtenerTarjeta() {
        this.loading = true;
        (await this.deudaService.getTarjeta()).subscribe({
            next: ({tarjeta}: {tarjeta: any}) => {
                this.tarjetas = tarjeta;
                this.loading = false;
            },
            error: (error: any) => {}
        });
    }

    async deleteDeuda(deuda: any) {
        if (confirm('¿Estás seguro de eliminar la deuda?')) {
            await this.deudaService.eliminarDeuda(deuda.id);
            this.sumaTotalReal = 0;
            this.sumaTotalPagoMensual = 0;
            this.obtenerIngresos();
            this.obtenerDeuda();
            this.toastr.info('Deuda eliminada con éxito.');
        }
    }

    async deleteTarjeta(deuda: Tarjeta) {
        if (confirm('¿Estás seguro de eliminar la tarjeta?')) {
            await this.deudaService.eliminarTarjeta(deuda.id);
            this.sumaTotalReal = 0;
            this.sumaTotalPagoMensual = 0;
            this.obtenerIngresos();
            this.obtenerDeuda();
            this.toastr.info('Tarjeta eliminada con éxito.');
        }
    }

    async update() {
        this.loading = true;
        if (!this.isEditing) {
            const addDeuda = {
                deuda_pendiente: this.form.value.deuda_pendiente!,
                cuotas_totales: this.form.value.cuotas_totales!,
                cuotas_pagadas: this.form.value.cuotas_pagadas!,
                pago_mensual: this.form.value.pago_mensual!,
                dia_pago: this.form.value.dia_pago!,
                id_banco: this.form.value.id_banco!,
                id_tipo_deuda: this.form.value.id_tipo_deuda!
            };
            try {
                const res = await this.deudaService.agregarDeuda(addDeuda);
                this.modal.classList.remove('show');
                this.modal.style.display = 'none';
                if (res) {
                    this.sumaTotalReal = 0;
                    this.sumaTotalPagoMensual = 0;
                    this.obtenerIngresos();
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
                this.sumaTotalReal = 0;
                this.sumaTotalPagoMensual = 0;
                this.obtenerIngresos();
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

    async obtenerIngresos() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        (await this.ingresoService.getIngreso(month, year)).subscribe({
            next: ({sumaTotalReal}: {sumaTotalReal: number}) => {
                this.sumaTotalReal = sumaTotalReal;
                console.log(this.sumaTotalReal);
            },
            error: (error: any) => {
                console.log(error);
            }
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

    fechaActual = new Date();
    diasDelMesActual: number[] = [];

    setDiasDelMesActual(): void {
        const diasEnMes = new Date(
            this.fechaActual.getFullYear(),
            this.fechaActual.getMonth() + 1,
            0
        ).getDate();
        this.diasDelMesActual = Array.from(
            {length: diasEnMes},
            (_, i) => i + 1
        );
    }

    deudaForm = this.fb.group({
        descripcion: ['', Validators.required],
        // monto: ['', [Validators.required, Validators.min(1)]],
        salida: [this.fechaActual.getDate(), Validators.required]
    });

    setTipoDeuda(tipo: any, deuda: string) {
        this.selectedValorCuota = tipo.pago_mensual;

        this.selectedTipoDeuda = tipo.id_tipo_deuda;
        this.selectedTipoDeudaNombre = deuda;
        this.selectedTipoDeudaId = tipo.id;
    }

    async guardarDeudaEfectuado() {
        if (this.deudaForm.valid) {
            const descripcion = this.deudaForm.get('descripcion').value;
            // const monto: number = +this.deudaForm.get('monto').value;
            const dia = this.deudaForm.get('salida').value;
            const monto = this.selectedValorCuota;

            // --- esto es asi por que se cambio la categoria cuando es crédito hipotecario,
            //se va a gasto de hogar y arriendo/dividendo,
            let tipoGasto = 10;
            let tipoDeuda = this.selectedTipoDeuda;

            if (this.selectedTipoDeuda === 2) {
                tipoGasto = 1;
                tipoDeuda = 5;
            }
            //-----

            const gasto: Gasto = {
                id: 0,
                desc: descripcion,
                fijar: 0,
                tipo_gasto: tipoGasto,
                subtipo_gasto: tipoDeuda,
                dia: dia,
                mes: this.fechaActual.getMonth() + 1,
                anio: this.fechaActual.getFullYear(),
                monto: monto
            };

            console.log({gasto});

            (
                await this.gastoService.agregarGastoAsociandoDeuda(
                    gasto,
                    this.selectedTipoDeudaId
                )
            ).subscribe({
                complete: () => {
                    this.cerrarModal();
                    this.obtenerDeuda();
                    this.toastr.success('Ingresado correctamente');
                },
                error: ({error: {message}}: any) => {
                    this.loading = false;
                    this.toastr.error(message);
                }
            });
        } else {
            this.toastr.error(
                'Por favor completa todos los campos correctamente.'
            );
        }
    }
}
