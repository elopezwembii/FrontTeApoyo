import {Ingreso} from '@/interfaces/ingresos';
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
    options: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['Marzo', 'Abril']
        },
        series: [
            {
                name: 'Formales',
                type: 'bar',
                data: [1300000, 1400000]
            },
            {
                name: 'Informales',
                type: 'bar',
                data: [200000, 190000]
            }
        ]
    };

    dias: number[];

    generarDias(mes: number, anio: number) {
        // calcular el número de días del mes
        const diasEnMes = new Date(anio, mes, 0).getDate();
        // generar un array con los días del mes
        this.dias = Array.from({length: diasEnMes}, (_, i) => i + 1);
    }

    ingresos: Ingreso[] = [];
    sumaTotal: number = 0;

    ingresoSelected: Ingreso = {} as Ingreso;
    isEditing: boolean = false;
    isAdding: boolean = false;

    form = this.fb.group({
        id: [''],
        desc: ['', [Validators.required]],
        fijar: [false],
        tipo: [''],
        dia: [''],
        mes: [''],
        anio: [''],
        montoReal: ['', [Validators.required, Validators.min(0)]],
        montoPlanificado: ['', [Validators.required, Validators.min(0)]]
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

    obtenerIngresos() {
        const fechaString = `${this.selectionMonth + 1}/${this.year}`;
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
                sumaTotal,
                ingresos
            }: {
                sumaTotal: number;
                ingresos: Ingreso[];
            }) => {
                this.sumaTotal = sumaTotal;
                this.ingresos = ingresos;
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

        this.obtenerIngresos();
    }

    removeMonth() {
        this.selectionMonth--;
        if (this.selectionMonth < 0) {
            this.selectionMonth = 11;
            this.year--;
        }
        this.month = this.arrayMonth[this.selectionMonth];

        this.obtenerIngresos();
    }

    selectUser(ingreso: Ingreso) {
        if (Object.keys(this.ingresoSelected).length === 0) {
            this.ingresoSelected = ingreso;
            this.isEditing = true;
            this.isAdding = true;
            this.form.patchValue({
                id: String(ingreso.id),
                desc: ingreso.desc,
                fijar: ingreso.fijar,
                tipo: String(ingreso.tipo),
                dia: String(ingreso.dia),
                mes: String(ingreso.mes),
                anio: String(ingreso.anio),
                montoReal: String(ingreso.montoReal),
                montoPlanificado: String(ingreso.montoPlanificado)
            });
        }
    }

    deleteUser(index: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.ingresos.splice(index, 1);
        }
    }

    generateId() {
        return this.ingresos.length + 1;
    }

    update() {
        if (!this.isEditing) {
            this.ingresos[0] = {
                id: this.generateId(),
                desc: this.form.value.desc!,
                fijar: Boolean(this.form.value.fijar!),
                tipo: parseInt(this.form.value.tipo!),
                dia: parseInt(this.form.value.dia!),
                mes: this.selectionMonth + 1,
                anio: this.selectionYear,
                montoReal: parseInt(this.form.value.montoReal!),
                montoPlanificado: parseInt(this.form.value.montoPlanificado!)
            };

            console.log(this.ingresos[0]);

            this.ingresoService.agregarIngreso(this.ingresos[0]).subscribe({
                next: (resp: any) => {
                    this.toastr.success(resp);
                    this.obtenerIngresos();
                },
                error: (resp: any) => {
                    console.log(resp);
                }
            });
        } else {
            let index = this.ingresos
                .map((u) => u.id)
                .indexOf(this.ingresoSelected.id);

            this.ingresos[index] = {
                id: parseInt(this.form.value.id),
                desc: this.form.value.desc!,
                fijar: Boolean(this.form.value.fijar!),
                tipo: parseInt(this.form.value.tipo!),
                dia: parseInt(this.form.value.dia!),
                mes: parseInt(this.form.value.mes!),
                anio: parseInt(this.form.value.anio!),
                montoReal: parseInt(this.form.value.montoReal!),
                montoPlanificado: parseInt(this.form.value.montoPlanificado!)
            };

            this.ingresoService
                .actualizarIngreso(this.ingresos[index])
                .subscribe({
                    next: (resp: any) => {
                        this.toastr.success(resp);
                        this.obtenerIngresos();
                    },
                    error: (resp: any) => {
                        console.log(resp);
                    }
                });
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
            confirm(
                'All unsaved changes will be removed. Are you sure you want to cancel?'
            )
        ) {
            this.ingresos.splice(0, 1);
        }

        this.ingresoSelected = {} as Ingreso;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
    }

    addUser() {
        this.ingresos.unshift({
            id: null,
            desc: '',
            fijar: false,
            tipo: 0,
            dia: 0,
            mes: 0,
            anio: 0,
            montoReal: 0,
            montoPlanificado: 0
        });

        this.ingresoSelected = this.ingresos[0];
        this.isAdding = true;
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }

    onInput(monto: string, ischecked: boolean) {
        if (ischecked) {
            this.form.patchValue({
                ...this.form.value,
                montoReal: monto
            });
        }
    }
}
