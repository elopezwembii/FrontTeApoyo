import {Gasto} from '@/interfaces/gastos';
import {UiState} from '@/store/ui/state';
import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, Validators, FormsModule} from '@angular/forms';
import {GastosService} from '@services/gastos/gastos.service';
import {EChartsOption} from 'echarts';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-gastos',
    templateUrl: './gastos.component.html',
    styleUrls: ['./gastos.component.scss']
})
export class GastosComponent implements OnInit {
    gastoSelected: Gasto = {} as Gasto;
    isEditing: boolean = false;
    isAdding: boolean = false;
    change: boolean = false;
    loading: boolean = false;

    gastos: Gasto[] = [];
    sumaTotalReal: number = 0;

    objectTipo = [
        'Hogar',
        'Servicios básicos',
        'Alimentos y comida',
        'Entretenimiento',
        'Salud y Belleza',
        'Auto y Transporte',
        'Educación y trabajo',
        'Regalos y ayudas',
        'Viajes',
        'Créditos',
        'Ropa y Calzado',
        'Personal',
        'Compras Online',
        'Ahorro e Inversiones'
    ];

    opcionesSelect2 = {
        0: [
            'Artículos para el hogar',
            'Mascotas',
            'Limpieza y mantenimiento',
            'Gasto Común',
            'Arriendo o dividendo',
            'Asesora del hogar/niñera/cuidadora',
            'Seguro al hogar',
            'Otros hogar'
        ],
        1: ['Opcion D', 'Opcion E', 'Opcion F'],
        2: ['Opcion G', 'Opcion H', 'Opcion I']
    };

    dias: number[];

    generarDias(mes: number, anio: number) {
        // calcular el número de días del mes
        const diasEnMes = new Date(anio, mes, 0).getDate();
        // generar un array con los días del mes
        this.dias = Array.from({length: diasEnMes}, (_, i) => i + 1);
    }

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

    form = this.fb.group({
        id: [''],
        desc: ['', [Validators.required]],
        recurrente: [false],
        tipo: [null],
        subtipo: [null],
        dia: [''],
        mes: [this.selectionMonth + 1],
        anio: [this.year],
        monto: ['', [Validators.required, Validators.min(0)]]
    });

    get getFecha() {
        return `${this.year}/${this.selectionMonth + 1}/01`;
    }

    get getChange() {
        return this.change;
    }

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private gastoService: GastosService,
        private toastr: ToastrService
    ) {}
    ngOnInit(): void {
        this.obtenerGastos();

        this.generarDias(this.selectionMonth, this.selectionYear);
    }

    obtenerGastos() {
        this.loading = true;
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

        this.gastoService.getGasto(fechaInicio, fechaFin).subscribe({
            next: ({
                sumaTotalReal,
                gastos
            }: {
                sumaTotalReal: number;
                gastos: Gasto[];
            }) => {
                this.sumaTotalReal = sumaTotalReal;
                this.gastos = gastos;
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
        this.obtenerGastos();
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
        this.obtenerGastos();
        this.isAdding = false;
    }

    selectUser(gasto: Gasto) {
        if (Object.keys(this.gastoSelected).length === 0) {
            this.gastoSelected = gasto;
            this.isEditing = true;
            this.isAdding = true;
            this.form.patchValue({
                desc: gasto.desc,
                recurrente: gasto.recurrente,
                tipo: gasto.tipo,
                subtipo: String(gasto.subtipo),
                dia: String(gasto.dia),
                mes: gasto.mes,
                anio: gasto.anio,
                monto: String(gasto.monto)
            });
        }
    }

    deleteUser(index: number) {
        if (confirm('¿Estas seguro de eliminar el gasto?')) {
            this.gastos.splice(index, 1);
        }
    }

    generateId() {
        return this.gastos.length;
    }

    update() {
        this.loading = true;
        if (!this.isEditing) {
            this.gastos[0] = {
                id: this.generateId(),
                desc: this.form.value.desc!,
                recurrente: Boolean(this.form.value.recurrente!),
                tipo: this.form.value.tipo!,
                subtipo: parseInt(this.form.value.subtipo!),
                dia: parseInt(this.form.value.dia!),
                mes: this.selectionMonth + 1,
                anio: this.selectionYear,
                monto: parseInt(this.form.value.monto!)
            };

            console.log(this.gastos[0]);

            //llamada al servicio para agregar
            this.gastoService.agregarGasto(this.gastos[0]).subscribe({
                next: (resp: any) => {
                    this.toastr.success(resp);
                    this.obtenerGastos();
                    this.change = !this.change;
                    this.loading = false;
                },
                error: (resp: any) => {
                    console.log(resp);
                }
            });
        } else {
            let index = this.gastos
                .map((u) => u.id)
                .indexOf(this.gastoSelected.id);

            this.gastos[index] = {
                id: this.gastoSelected.id,
                desc: this.form.value.desc!,
                recurrente: Boolean(this.form.value.recurrente!),
                tipo: this.form.value.tipo!,
                subtipo: parseInt(this.form.value.subtipo!),
                dia: parseInt(this.form.value.dia!),
                mes: this.selectionMonth + 1,
                anio: this.selectionYear,
                monto: parseInt(this.form.value.monto!)
            };

            this.gastoService.actualizarGasto(this.gastos[index]).subscribe({
                next: (resp: any) => {
                    this.toastr.success(resp);
                    this.obtenerGastos();
                    this.change = !this.change;
                    this.loading = false;
                },
                error: (resp: any) => {
                    console.log(resp);
                }
            });
        }

        // clean up
        this.gastoSelected = {} as Gasto;
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
            this.gastos.splice(0, 1);
        }

        this.gastoSelected = {} as Gasto;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
    }

    addUser() {
        this.gastos.unshift({
            id: null,
            desc: '',
            recurrente: false,
            tipo: null,
            subtipo: 0,
            dia: 0,
            mes: 0,
            anio: 0,
            monto: 0
        });

        this.gastoSelected = this.gastos[0];
        this.isAdding = true;
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }
}
