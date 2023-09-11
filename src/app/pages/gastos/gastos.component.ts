import {Gasto} from '@/interfaces/gastos';
import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {GastosService} from '@services/gastos/gastos.service';

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
    dias: number[];

    gastos: Gasto[] = [];
    sumaTotalReal: number = 0;

    opcionesSelect2 = {
        1: [
            'Artículos para el hogar',
            'Mascotas',
            'Limpieza y mantenimiento',
            'Gasto Común',
            'Arriendo o dividendo',
            'Asesora del hogar/niñera/cuidadora',
            'Seguro al hogar',
            'Otros hogar'
        ],
        2: ['Agua', 'Luz', 'Gas', 'Cable/Internet', 'Alarma', 'Telefonía'],
        3: [
            'Supermercado',
            'Feria',
            'Agua en botellón',
            'Antojos (bebidas, agua, café, snacks)',
            'Comida rápida',
            'Gastos en delivery y propinas',
            'Otros alimentos'
        ],
        4: [
            'Juguetes y videojuegos',
            'Suscripciones y apps',
            'Bares, pubs, restaurantes',
            'Espectáculos y eventos',
            'Otros entretenimientos'
        ],
        5: [
            'Perfumes y cosméticos',
            'Salón de belleza/Barbería',
            'Médico/Dentista',
            'Gimnasio (mensual)',
            'Arriendo canchas (deporte)',
            'Farmacia',
            'Cuidado personal/Terapias',
            'Otros salud y belleza'
        ],
        6: [
            'Mantenimiento y reparaciones',
            'Autolavado',
            'Transporte público',
            'Gasolina',
            'Taxi-Uber-Didi',
            'Peajes/Autopistas',
            'Estacionamiento diario',
            'Estacionamiento mensual',
            'Seguro',
            'Otros auto y transporte'
        ],
        7: [
            'Servicios legales/contables',
            'Otros educación y trabajo',
            'Colegiatura',
            'Academias/Cuotas de curso',
            'Artículos librería/escritorio',
            'Transporte Escolar',
            'Otros educación y trabajo'
        ],
        8: [
            'Donaciones',
            'Apoyo a familiares y amigos',
            'Regalos',
            'Otros regalos y ayuda'
        ],
        9: ['Hospedaje', 'Vuelos', 'Otros gastos de viajes'],
        10: [
            // 'Casas comerciales',
            // 'Créditos de consumo',
            // 'Crédito automotriz',
            // 'Tarjeta de crédito',
            // 'Línea de crédito',
            // 'Otros pagos de créditos'
            'Créditos de consumo',
            'Crédito hipotecario',
            'Casas comerciales',
            'Crédito automotriz',
            'Tarjeta de crédito',
            'Línea de crédito',
            'Otros pagos de créditos'
        ],
        11: [
            'Calzado',
            'Accesorios',
            'Lavandería y tintorería',
            'Ropa',
            'Otros Ropa y Cazado'
        ],
        12: [
            'Impuestos',
            'Pago pensión de alimentos',
            'Seguros de vida',
            'Alcohol',
            'Tabaco',
            'Juegos de azar/Apuestas online'
        ],
        13: [
            'Ali express/Shein',
            'Grandes tiendas/Mercado libre',
            'Otras compras online'
        ],
        14: [
            'Ahorro celebraciones',
            'Ahorro cumpleaños',
            'Ahorro Educación',
            'Ahorro fiestas patrias',
            'Ahorro fin de semana largo',
            'Ahorro navidad/año nuevo',
            'Ahorro viajes/vacaciones',
            'Fondo de emergencia',
            'Ahorro general (varios)',
            'Inversiones y Acciones'
        ]
    };

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
        desc: [''],
        fijar: [0],
        tipo_gasto: [0, [Validators.required]],
        subtipo_gasto: [0,[Validators.required]],
        dia: [''],
        mes: [''],
        anio: [''],
        monto: ['',[Validators.required]]
    });

    get getMes() {
        return this.selectionMonth + 1;
    }

    get getAnio() {
        return this.year;
    }

    get getChange() {
        return this.change;
    }

    get getTipo() {
        return this.form.get('tipo_gasto').value;
    }

    get getSumaTotal() {
        return this.sumaTotalReal;
    }

    objectTipo;
    windowSize: number;

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private gastoService: GastosService,
        private toastr: ToastrService,
        private router: Router
    ) {
        this.objectTipo = [
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

        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.windowSize = window.innerWidth;
            }
        });

        this.renderer.listen('window', 'load', (evt) => {
            this.windowSize = window.innerWidth;
        });
        this.renderer.listen('window', 'resize', (evt) => {
            this.windowSize = window.innerWidth;
            console.log(window.innerWidth);
        });
    }

    ngOnInit() {
        this.obtenerGastos();
        this.generarDias(this.selectionMonth, this.selectionYear);
    }

    async obtenerGastos() {
        this.loading = true;
        (
            await this.gastoService.getGasto(this.selectionMonth + 1, this.year)
        ).subscribe({
            next: ({
                sumaTotalReal,
                gastos
            }: {
                sumaTotalReal: number;
                gastos: Gasto[];
            }) => {

                console.log('gastos',gastos);
                

                this.sumaTotalReal = sumaTotalReal;
                this.gastos = gastos;
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
                fijar: gasto.fijar,
                tipo_gasto: gasto.tipo_gasto,
                subtipo_gasto: 0,
                dia: String(gasto.dia),
                mes: String(this.selectionMonth + 1),
                anio: String(this.year),
                monto: String(gasto.monto)
            });
            this.abrirModal();
        }
    }

    async deleteUser(gasto: Gasto) {
        if (confirm('¿Estas seguro de eliminar el gasto?')) {
            await this.gastoService.eliminarGasto(gasto.id);
            this.obtenerGastos();
            this.toastr.info('Gasto eliminado con éxito');
        }
    }

    modal: HTMLElement;

    abrirModal() {
        if (this.windowSize <= 1000) {
            this.modal = document.getElementById('modalAgregarGasto');
            this.modal.classList.add('show');
            this.modal.style.display = 'block';
        }
    }

    cerrarModal() {
        if (this.windowSize <= 1000) {
            this.modal.classList.remove('show');
            this.modal.style.display = 'none';
            this.gastoSelected = {} as Gasto;
            this.isEditing = false;
            this.isAdding = false;
            this.form.reset();
            this.toastr.info('No se realizaron cambios...');
        }
    }

    async update() {
        this.loading = true;
        if (!this.isEditing) {
            this.gastos[0] = {
                id: 0,
                desc: this.form.value.desc!,
                fijar: Boolean(this.form.value.fijar!) ? 1 : 0,
                tipo_gasto: this.form.value.tipo_gasto!,
                subtipo_gasto: this.form.value.subtipo_gasto!,
                dia: parseInt(this.form.value.dia!),
                mes: this.selectionMonth + 1,
                anio: this.selectionYear,
                monto: parseInt(this.form.value.monto!)
            };

            try {
                const res = await this.gastoService.agregarGasto(
                    this.gastos[0]
                );
                if (this.windowSize <= 1000) {
                    this.modal.classList.remove('show');
                    this.modal.style.display = 'none';
                }
                if (res) {
                    this.change = !this.change;
                    this.obtenerGastos();
                    this.toastr.info('Gasto agregado con éxito');
                } else {
                    this.toastr.error('Error al agregar un nuevo gasto.');
                    this.loading = false;
                }
            } catch (error) {}
        } else {
            let index = this.gastos
                .map((u) => u.id)
                .indexOf(this.gastoSelected.id);

            this.gastos[index] = {
                id: this.gastoSelected.id,
                desc: this.form.value.desc!,
                fijar: this.form.value.fijar!,
                tipo_gasto: this.form.value.tipo_gasto!,
                subtipo_gasto: this.form.value.subtipo_gasto!,
                dia: parseInt(this.form.value.dia!),
                mes: this.selectionMonth + 1,
                anio: this.year,
                monto: parseInt(this.form.value.monto!)
            };
            console.log(this.gastos[index]);

            try {
                const res = await this.gastoService.actualizarGasto(
                    this.gastos[index],
                    this.selectionMonth + 1,
                    this.year
                );
                if (this.windowSize <= 1000) {
                    this.modal.classList.remove('show');
                    this.modal.style.display = 'none';
                }
                if (res) {
                    this.change = !this.change;
                    this.obtenerGastos();
                    this.toastr.info('Gasto editado con éxito');
                } else {
                    this.toastr.error('Error al editar un gasto.');
                    this.loading = false;
                }
            } catch (error) {}
        }

        // clean up
        this.gastoSelected = {} as Gasto;
        this.isEditing = false;
        this.isAdding = false;

        this.form.reset();
    }

    cancel() {
        if (!this.isEditing) {
            this.gastos.pop();
        }

        this.gastoSelected = {} as Gasto;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
        this.toastr.info('No se realizaron cambios...');
    }

    addUser() {
        this.gastos.push({
            id: null,
            desc: '',
            fijar: 0,
            tipo_gasto: 0,
            subtipo_gasto: 0,
            dia: 0,
            mes: 0,
            anio: 0,
            monto: 0
        });

        this.gastoSelected = this.gastos[this.gastos.length - 1];
        this.isAdding = true;
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }
}
