import {Ingreso} from './../../interfaces/ingresos';
import {Component, OnInit, Renderer2} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import {IngresosService} from '@services/ingresos/ingresos.service';
import {EChartsOption} from 'echarts';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-ingresos',
    templateUrl: './ingresos.component.html',
    styleUrls: ['./ingresos.component.scss']
})
export class IngresosComponent implements OnInit {
    dias: number[];
    change: boolean = false;
    loading: boolean = false;
    ingresos: Ingreso[] = [];
    sumaTotalReal: number = 0;

    ingresoSelected: Ingreso = {} as Ingreso;
    isEditing: boolean = false;
    isAdding: boolean = false;

    objectTipo = [
        'Sueldo líquido',
        'Boletas de honorarios',
        'Arriendos',
        'Declaración de Renta (anual)',
        'Pensión de alimentos recibida',
        'Reembolsos o ayudas recibidas',
        'Otros ingresos formales o informales'
    ];

    generarDias(mes: number, anio: number) {
        // calcular el número de días del mes
        const diasEnMes = new Date(anio, mes, 0).getDate();
        // generar un array con los días del mes
        this.dias = Array.from({length: diasEnMes}, (_, i) => i + 1);
    }



    form = this.fb.group({
        id: [''],
        desc: [''],
        fijar: [0],
        tipo_ingreso: [0, [Validators.required]],
        dia: [0, [Validators.required]],
        mes: [''],
        anio: [''],
        montoReal: ['', [Validators.required, Validators.min(0)]],
        montoPlanificado: ['']
    });

    public arrayMonth = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ];
    public selectionMonth: number = new Date().getMonth();
    public selectionYear: number = new Date().getFullYear();

    public month: string = this.arrayMonth[this.selectionMonth];
    public year: number = this.selectionYear;

    get getFecha() {
        return `${this.year}/${this.selectionMonth + 1}/01`;
    }

    get getMes() {
        return this.selectionMonth + 1;
    }

    get getAnio() {
        return this.year;
    }

    get getChange() {
        return this.change;
    }

    public arrayRec = [
        [
            'Hay dos formas que son las más utilizadas, para calcular el sueldo líquido.',
            "1. Calcula entre el 75% u 80% sobre el 'total de haberes' de tu liquidación.",
            '2. Al total de haberes, resta los descuentos legales: AFP, Isapre (sólo el 7% legal) y el impuesto a la renta si es que por tramo te corresponde el descuento.'
        ],
        [
            'Se promedian al menos 6 meses de boletas, descontando la retención correspondiente.'
        ],
        ['Normalmente se considera el 100% del canon de arriendo.'],
        [
            'Considera el valor de la línea 170 (Base Imponible Anual) y se le resta el impuesto a pagar, línea 93 (Total a pagar).',
            'El resultado se divide por los 12, para hacer el promedio mensual de ingreso.',
            'Si consideras la Declaración, no puedes ingresar sueldo, ni boletas, al estar ya incluidos en ésta.'
        ],
        ["Considera el total del valor."],
        ["Considera el total del valor."],
        ["Considera el total del valor."],
    ];

    get getTipo() {
        return this.form.get('tipo_ingreso').value;
    }

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private ingresoService: IngresosService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.obtenerIngresos();

        this.generarDias(this.selectionMonth, this.selectionYear);
    }

    async obtenerIngresos() {
        this.loading = true;
        /* const fechaString = `${this.selectionMonth + 1}/${this.year}`;
        const [dia, anio] = fechaString.split('/').map(Number);
        const mes = dia - 1;
        const primerDia = new Date(anio, mes, 1);
        const fechaInicio = `${primerDia.getFullYear()}-${
            primerDia.getMonth() + 1
        }-${primerDia.getDate()}`;
        const ultimoDia = new Date(anio, mes + 1, 0);
        const fechaFin = `${ultimoDia.getFullYear()}-${
            ultimoDia.getMonth() + 1
        }-${ultimoDia.getDate()}`;

        this.ingresoService.getIngreso(fechaInicio, fechaFin).subscribe({
            next: ({
                sumaTotalReal,
                ingresos
            }: {
                sumaTotalReal: number;
                ingresos: Ingreso[];
            }) => {
                this.sumaTotalReal = sumaTotalReal;
                this.ingresos = ingresos;
                this.loading = false;
            },
            error: (error: any) => {
                console.log(error);
            }
        }); */
        (
            await this.ingresoService.getIngreso(
                this.selectionMonth + 1,
                this.year
            )
        ).subscribe({
            next: ({
                sumaTotalReal,
                ingresos
            }: {
                sumaTotalReal: number;
                ingresos: Ingreso[];
            }) => {
                console.log(ingresos);
                this.sumaTotalReal = sumaTotalReal;
                this.ingresos = ingresos;
                this.change = !this.change;
                this.loading = false;
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    addMonth() {
        this.selectionMonth++;
        if (this.selectionMonth > 11) {
            this.selectionMonth = 0;
            this.year++;
        }
        this.month = this.arrayMonth[this.selectionMonth];
        this.generarDias(this.selectionMonth, this.year);
        this.obtenerIngresos();
        this.isAdding = false;
    }

    removeMonth() {
        this.selectionMonth--;
        if (this.selectionMonth < 0) {
            this.selectionMonth = 11;
            this.year--;
        }
        this.month = this.arrayMonth[this.selectionMonth];
        this.generarDias(this.selectionMonth, this.year);
        this.obtenerIngresos();
        this.isAdding = false;
    }

    selectUser(ingreso: Ingreso) {
        if (Object.keys(this.ingresoSelected).length === 0) {
            this.ingresoSelected = ingreso;
            console.log(ingreso);
            this.isEditing = true;
            this.isAdding = true;
            this.form.patchValue({
                id: String(ingreso.id),
                desc: ingreso.desc,
                fijar: ingreso.fijar,
                tipo_ingreso: ingreso.tipo_ingreso,
                dia: ingreso.dia,
                mes: String(ingreso.mes),
                anio: String(ingreso.anio),
                montoReal: String(ingreso.monto_real),
                montoPlanificado: String(ingreso.montoPlanificado)
            });
        }
    }

    async deleteUser(ingreso: Ingreso) {
        if (confirm('¿Estas seguro de eliminar el ingreso?')) {
            await this.ingresoService.eliminarIngreso(ingreso.id);
            this.obtenerIngresos();
        }
    }

    async update() {
        this.loading = true;
        if (!this.isEditing) {
            this.ingresos[0] = {
                id: 0,
                desc: this.form.value.desc!,
                fijar: Boolean(this.form.value.fijar!) ? 1 : 0,
                tipo_ingreso: this.form.value.tipo_ingreso!,
                dia: this.form.value.dia!,
                mes: this.selectionMonth + 1,
                anio: this.selectionYear,
                monto_real: parseInt(this.form.value.montoReal!),
                montoPlanificado: parseInt(this.form.value.montoPlanificado!)
            };

            try {
                await this.ingresoService.agregarIngreso(this.ingresos[0]);
                this.obtenerIngresos();
                this.change = !this.change;
            } catch (error) {}
            /* (
                await this.ingresoService.getIngreso(
                    this.selectionMonth + 1,
                    this.year
                )
            ).subscribe({
                next: ({
                    sumaTotalReal,
                    ingresos
                }: {
                    sumaTotalReal: number;
                    ingresos: Ingreso[];
                }) => {
                    console.log(ingresos);
                    this.sumaTotalReal = sumaTotalReal;
                    this.ingresos = ingresos;
                    this.loading = false;
                },
                error: (error: any) => {
                    console.log(error);
                }
            }); */

            /* this.ingresoService.agregarIngreso(this.ingresos[0]).subscribe({
                next: (resp: any) => {
                    this.toastr.success(resp);
                    this.obtenerIngresos();
                    this.change = !this.change;
                    this.loading = false;
                },
                error: (resp: any) => {
                    console.log(resp);
                }
            }); */
        } else {
            let index = this.ingresos
                .map((u) => u.id)
                .indexOf(this.ingresoSelected.id);

            this.ingresos[index] = {
                id: parseInt(this.form.value.id),
                desc: this.form.value.desc!,
                fijar: this.form.value.fijar!,
                tipo_ingreso: this.form.value.tipo_ingreso!,
                dia: this.form.value.dia!,
                mes: parseInt(this.form.value.mes!),
                anio: parseInt(this.form.value.anio!),
                monto_real: parseInt(this.form.value.montoReal!),
                montoPlanificado: parseInt(this.form.value.montoPlanificado!)
            };
            try {
                await this.ingresoService.actualizarIngreso(
                    this.ingresos[index]
                );
                this.obtenerIngresos();
                this.change = !this.change;
            } catch (error) {}
            /* this.ingresoService
                .actualizarIngreso(this.ingresos[index])
                .subscribe({
                    next: (resp: any) => {
                        this.toastr.success(resp);
                        this.obtenerIngresos();
                        this.change = !this.change;
                        this.loading = false;
                    },
                    error: (resp: any) => {
                        console.log(resp);
                    }
                }); */
        }
        // clean up
        this.ingresoSelected = {} as Ingreso;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
    }

    cancel() {
        if (
            !this.isEditing &&
            confirm('¿Desea continuar sin guardar los cambios?')
        ) {
            this.ingresos.pop();
        }

        this.ingresoSelected = {} as Ingreso;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
        this.toastr.info('No se realizaron cambios...');
    }

    addUser() {
        this.ingresos.push({
            id: null,
            desc: '',
            fijar: 0,
            tipo_ingreso: 0,
            dia: 0,
            mes: 0,
            anio: 0,
            monto_real: 0,
            montoPlanificado: 0
        });

        this.ingresoSelected = this.ingresos[this.ingresos.length - 1];
        this.isAdding = true;
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }
}
