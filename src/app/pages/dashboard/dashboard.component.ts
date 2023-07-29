import {
    Categoria,
    ItemPresupuesto,
    Presupuesto
} from '@/interfaces/presupuesto';
import {Ahorro, TipoAhorro} from './../../interfaces/ahorro';
import {Component, OnInit, Renderer2} from '@angular/core';
import {AhorroService} from '@services/ahorro/ahorro.service';
import {AppService} from '@services/app.service';
import {GastosService} from '@services/gastos/gastos.service';
import {PresupuestoService} from '@services/presupuesto/presupuesto.service';
import {ToastrService} from 'ngx-toastr';
import {forkJoin} from 'rxjs';
import {Gasto} from '@/interfaces/gastos';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {ShepherdService} from 'angular-shepherd';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    usuario: any;
    graficoDonaPresupuesto: any;
    gastosGraficoBarra: any;
    gastosGraficoBarraTotal: any;
    gastosHormigas: any = [];
    ahorros: Ahorro[] = [];
    posibleAhorro: number;
    nivel: string;
    siguienteNivel: string;
    ahorroSiguienteNivel: number;
    sumaGH: number = 0;
    presupuesto: Presupuesto = {} as Presupuesto;
    loading: boolean = false;
    loading2: boolean = false;
    categorias: Categoria[];
    topGastos: Array<any> = [];
    public tiposAhorro: TipoAhorro[] = [
        {
            id: 1,
            descripcion: 'Ahorro celebraciones',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 2,
            descripcion: 'Ahorro cumpleaños',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 3,
            descripcion: 'Ahorro Educación',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 4,
            descripcion: 'Ahorro fiestas patrias',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 5,
            descripcion: 'Ahorro fin de semana largo',
            img: 'assets/img/ahorro/ahorro3.svg'
        },
        {
            id: 6,
            descripcion: 'Ahorro navidad/año nuevo',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 7,
            descripcion: 'Ahorro viajes/vacaciones',
            img: 'assets/img/ahorro/ahorro3.svg'
        },
        {
            id: 8,
            descripcion: 'Fondo de emergencia',
            img: 'assets/img/ahorro/ahorro4.svg'
        },
        {
            id: 9,
            descripcion: 'Ahorro general (varios)',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 10,
            descripcion: 'Inversiones y Acciones',
            img: 'assets/img/ahorro/ahorro1.svg'
        }
    ];

    itemsPresupuesto: ItemPresupuesto[] = [];
    presupuestoMonto: number = 0;
    sumaTotalReal: number = 0;
    actualMonth: number = new Date().getMonth();

    form = this.fb.group({
        id: [''],
        desc: [''],
        fijar: [0],
        tipo_gasto: [0, [Validators.required]],
        subtipo_gasto: [0, [Validators.required]],
        dia: [''],
        mes: [''],
        anio: [''],
        monto: ['', [Validators.required]]
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

    constructor(
        private presupuestoService: PresupuestoService,
        private ahorroService: AhorroService,
        private gastosService: GastosService,
        private appService: AppService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private router: Router,
        private renderer: Renderer2,
        private shepherdService: ShepherdService
    ) {
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
        });
    }

    defaultStep = [
        {
            id: 'intro',
            attachTo: {
                element: '.first-element',
                on: 'bottom'
            },
            buttons: [
                {
                    classes: 'shepherd-button-secondary',
                    text: 'Exit',
                    type: 'cancel'
                },
                {
                    classes: 'shepherd-button-primary',
                    text: 'Back',
                    type: 'back'
                },
                {
                    classes: 'shepherd-button-primary',
                    text: 'Next',
                    type: 'next'
                }
            ],
            cancelIcon: {
                enabled: true
            },
            classes: 'custom-class-name-1 custom-class-name-2',
            highlightClass: 'highlight',
            scrollTo: false,
            title: 'Welcome to Angular-Shepherd!',
            text: [
                'Angular-Shepherd is a JavaScript library for guiding users through your Angular app.'
            ],
            when: {
                show: () => {
                    console.log('show step');
                },
                hide: () => {
                    console.log('hide step');
                }
            }
        }
    ];

    async ngOnInit() {
        this.loading = true;
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
        this.categorias = [
            {
                id: 1,
                descripcion: 'Hogar',
                img: 'fas fa-home'
            },
            {
                id: 2,
                descripcion: 'Servicios básicos',
                img: 'fas fa-wrench'
            },
            {
                id: 3,
                descripcion: 'Alimento y comida',
                img: 'fas fa-utensils'
            },
            {
                id: 4,
                descripcion: 'Entretenimiento',
                img: 'fas fa-gamepad'
            },
            {
                id: 5,
                descripcion: 'Salud y belleza',
                img: 'fas fa-heart'
            },
            {
                id: 6,
                descripcion: 'Auto y transporte',
                img: 'fas fa-car'
            },
            {
                id: 7,
                descripcion: 'Educación y trabajo',
                img: 'fas fa-graduation-cap'
            },
            {
                id: 8,
                descripcion: 'Regalo y ayudas',
                img: 'fas fa-gift'
            },
            {
                id: 9,
                descripcion: 'Viajes',
                img: 'fas fa-plane'
            },
            {
                id: 10,
                descripcion: 'Créditos',
                img: 'fas fa-credit-card'
            },
            {
                id: 11,
                descripcion: 'Ropa y calzado',
                img: 'fas fa-tshirt'
            },
            {
                id: 12,
                descripcion: 'Personal',
                img: 'fas fa-user'
            },
            {
                id: 13,
                descripcion: 'Compras Online',
                img: 'fas fa-shopping-cart'
            },
            {
                id: 14,
                descripcion: 'Ahorro e inversiones',
                img: 'fas fa-piggy-bank'
            }
        ];
        /* this.obtenerDatoGrafico(); */
        //this.obtenerGastos();
        this.obtenerPresupuesto();
        this.obtenerAhorros();
        this.obtenerGastoHormiga();
        this.obtenerUsuario();

        if (!localStorage.getItem('tourInicial')) {
            //ejecutar Tour
            this.guia();

            localStorage.setItem('tourInicial', 'realizado');
        }
    }

    dias: number[];
    isEditing: boolean = false;
    isAdding: boolean = false;
    gastos: Gasto[] = [];
    windowSize: number;
    modal: HTMLElement;
    gastoSelected: Gasto = {} as Gasto;
    objectTipo;
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
            'Casas comerciales',
            'Créditos de consumo',
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
            dia: new Date().getDate(),
            mes: new Date().getMonth() + 1,
            anio: new Date().getFullYear(),
            monto: 0
        });

        this.gastoSelected = this.gastos[this.gastos.length - 1];
        this.isAdding = true;
    }

    async obtenerGastos() {
        this.loading = true;
        (
            await this.gastosService.getGasto(
                new Date().getMonth() + 1,
                new Date().getFullYear()
            )
        ).subscribe({
            next: ({
                sumaTotalReal,
                gastos
            }: {
                sumaTotalReal: number;
                gastos: Gasto[];
            }) => {
                this.sumaGH = 0;
                this.gastosHormigas = gastos.filter(
                    (gasto) =>
                        gasto.subtipo_gasto === 34 ||
                        gasto.subtipo_gasto === 35 ||
                        gasto.subtipo_gasto === 36 ||
                        gasto.subtipo_gasto === 41 ||
                        gasto.subtipo_gasto === 42 ||
                        gasto.subtipo_gasto === 55 ||
                        gasto.subtipo_gasto === 62 ||
                        gasto.subtipo_gasto === 65 ||
                        gasto.subtipo_gasto === 67 ||
                        gasto.subtipo_gasto === 81 ||
                        gasto.subtipo_gasto === 125 ||
                        gasto.subtipo_gasto === 126 ||
                        gasto.subtipo_gasto === 131 ||
                        gasto.subtipo_gasto === 132 ||
                        gasto.subtipo_gasto === 133
                );
                this.gastosHormigas = this.gastosHormigas.reduce(
                    (acumulador, valorActual) => {
                        const elementoYaExiste = acumulador.find(
                            (elemento) =>
                                elemento.subtipo_gasto ===
                                valorActual.subtipo_gasto
                        );
                        if (elementoYaExiste) {
                            return acumulador.map((elemento) => {
                                if (
                                    elemento.subtipo_gasto ===
                                    valorActual.subtipo_gasto
                                ) {
                                    return {
                                        ...elemento,
                                        monto:
                                            elemento.monto + valorActual.monto
                                    };
                                }

                                return elemento;
                            });
                        }

                        return [...acumulador, valorActual];
                    },
                    []
                );
                this.gastosHormigas.forEach((gh) => {
                    if (
                        gh.subtipo_gasto === 34 ||
                        gh.subtipo_gasto === 35 ||
                        gh.subtipo_gasto === 36
                    ) {
                        gh.img = 'assets/img/hormiga/34.svg';
                    }
                    if (gh.subtipo_gasto === 41 || gh.subtipo_gasto === 42) {
                        gh.img = 'assets/img/hormiga/41.svg';
                    }
                    if (gh.subtipo_gasto === 55) {
                        gh.img = 'assets/img/hormiga/55.svg';
                    }
                    if (gh.subtipo_gasto === 62 || gh.subtipo_gasto === 67) {
                        gh.img = 'assets/img/hormiga/67.svg';
                    }
                    if (gh.subtipo_gasto === 65) {
                        gh.img = 'assets/img/hormiga/65.svg';
                    }
                    if (gh.subtipo_gasto === 81) {
                        gh.img = 'assets/img/hormiga/81.svg';
                    }
                    if (gh.subtipo_gasto === 125) {
                        gh.img = 'assets/img/hormiga/125.svg';
                    }
                    if (gh.subtipo_gasto === 126) {
                        gh.img = 'assets/img/hormiga/126.svg';
                    }
                    if (gh.subtipo_gasto === 131 || gh.subtipo_gasto === 132) {
                        gh.img = 'assets/img/hormiga/131.svg';
                    }
                    if (gh.subtipo_gasto === 133) {
                        gh.img = 'assets/img/hormiga/133.svg';
                    }
                    this.sumaGH += gh.monto;
                });
                this.gastosHormigas = this.gastosHormigas.sort((p1, p2) =>
                    p1.monto < p2.monto ? 1 : p1.monto > p2.monto ? -1 : 0
                );
                this.sumaTotalReal = sumaTotalReal;
                gastos = gastos.reverse();
                if (gastos.length > 3) gastos.length = 3;
                this.gastos = gastos;
                this.loading = false;
            },
            error: (error: any) => {}
        });
    }

    get getTipo() {
        return this.form.get('tipo_gasto').value;
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
                dia: new Date().getDate(),
                mes: new Date().getMonth() + 1,
                anio: new Date().getFullYear(),
                monto: parseInt(this.form.value.monto!)
            };

            try {
                const res = await this.gastosService.agregarGasto(
                    this.gastos[0]
                );
                console.log(res);
                if (res) {
                    this.obtenerGastos();
                    this.obtenerPresupuesto();
                    this.obtenerAhorros();
                    this.obtenerGastoHormiga();
                    this.obtenerUsuario();
                    this.toastr.info('Gasto agregado con éxito');
                } else {
                    this.toastr.error('Error al agregar un nuevo gasto.');
                    this.loading = false;
                }
            } catch (error) {
                this.toastr.error('Error al agregar un nuevo gasto.');
                this.loading = false;
            }
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
                dia: new Date().getDate(),
                mes: new Date().getMonth() + 1,
                anio: new Date().getFullYear(),
                monto: parseInt(this.form.value.monto!)
            };

            try {
                const res = await this.gastosService.actualizarGasto(
                    this.gastos[index],
                    new Date().getMonth() + 1,
                    new Date().getFullYear()
                );
                if (this.windowSize <= 1000) {
                    this.modal.classList.remove('show');
                    this.modal.style.display = 'none';
                }
                if (res) {
                    this.obtenerGastos();
                    this.obtenerPresupuesto();
                    this.obtenerAhorros();
                    this.obtenerGastoHormiga();
                    this.obtenerUsuario();
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
                dia: String(new Date().getDate()),
                mes: String(new Date().getMonth() + 1),
                anio: String(new Date().getFullYear()),
                monto: String(gasto.monto)
            });
            this.abrirModal();
        }
    }

    async deleteUser(gasto: Gasto) {
        if (confirm('¿Estas seguro de eliminar el gasto?')) {
            await this.gastosService.eliminarGasto(gasto.id);
            this.obtenerGastos();
            this.obtenerPresupuesto();
            this.obtenerAhorros();
            this.obtenerGastoHormiga();
            this.obtenerUsuario();
            this.toastr.info('Gasto eliminado con éxito');
        }
    }

    abrirModal() {
        if (this.windowSize <= 1000) {
            this.modal = document.getElementById('exampleModal');
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

    async obtenerAhorros() {
        (await this.ahorroService.obtenerAhorros()).subscribe({
            next: ({ahorros}: {ahorros: any}) => {
                this.ahorros = ahorros;
            },
            error: (error: any) => {}
        });
    }

    async obtenerGastoHormiga() {
        this.obtenerGastos();
    }

    async obtenerPresupuesto() {
        this.loading = true;
        this.presupuestoMonto = 0;
        (
            await this.presupuestoService.getPresupuesto(
                new Date().getMonth() + 1,
                new Date().getFullYear()
            )
        ).subscribe({
            next: ({presupuesto}: {presupuesto: Presupuesto}) => {
                this.presupuesto = presupuesto;
                this.sumaTotalReal = presupuesto.presupuesto;
                this.itemsPresupuesto = this.presupuesto.get_items;
                this.graficoDonaPresupuesto = this.presupuesto.get_items.map(
                    (item) => {
                        return {
                            name: this.categorias[item.tipo_gasto - 1]
                                .descripcion,
                            value: item.monto
                        };
                    }
                );
            },
            error: (error: any) => {}
        });
        (
            await this.gastosService.getGasto(
                new Date().getMonth() + 1,
                new Date().getFullYear()
            )
        ).subscribe({
            next: ({
                gastos,
                sumaTotalReal
            }: {
                gastos: Gasto[];
                sumaTotalReal: number;
            }) => {
                //aux no repetido
                let gastosNoRepetido;
                //ordenar por monto
                gastos = gastos.sort((p1, p2) =>
                    p1.monto < p2.monto ? 1 : p1.monto > p2.monto ? -1 : 0
                );
                //clon de gastos
                let totalGastos = [].concat(gastos);
                //limitar gastos
                if (gastos.length > 5) gastos.length = 5;
                //reducir los repetidos limitados
                gastosNoRepetido = gastos.reduce((acumulador, valorActual) => {
                    const elementoYaExiste = acumulador.find(
                        (elemento) =>
                            elemento.tipo_gasto === valorActual.tipo_gasto
                    );
                    if (elementoYaExiste) {
                        return acumulador.map((elemento) => {
                            if (
                                elemento.tipo_gasto === valorActual.tipo_gasto
                            ) {
                                return {
                                    ...elemento,
                                    monto: elemento.monto + valorActual.monto
                                };
                            }

                            return elemento;
                        });
                    }

                    return [...acumulador, valorActual];
                }, []);

                //reducir los repetidos no limitados
                let gastosNoRepetido2 = totalGastos.reduce(
                    (acumulador, valorActual) => {
                        const elementoYaExiste = acumulador.find(
                            (elemento) =>
                                elemento.tipo_gasto === valorActual.tipo_gasto
                        );
                        if (elementoYaExiste) {
                            return acumulador.map((elemento) => {
                                if (
                                    elemento.tipo_gasto ===
                                    valorActual.tipo_gasto
                                ) {
                                    return {
                                        ...elemento,
                                        monto:
                                            elemento.monto + valorActual.monto
                                    };
                                }

                                return elemento;
                            });
                        }

                        return [...acumulador, valorActual];
                    },
                    []
                );
                this.gastosGraficoBarra = gastosNoRepetido.map((gasto) => {
                    return {
                        name: this.categorias[gasto.tipo_gasto - 1].descripcion,
                        value: gasto.monto
                    };
                });
                this.gastosGraficoBarraTotal = gastosNoRepetido2.map(
                    (gasto) => {
                        return {
                            name: this.categorias[gasto.tipo_gasto - 1]
                                .descripcion,
                            value: gasto.monto
                        };
                    }
                );
            },
            error: (error: any) => {}
        });
        this.loading = false;
    }

    obtenerUsuario() {
        this.usuario = JSON.parse(sessionStorage.getItem('user'));
        this.ahorroService.obtenerNivelAhorroUsuario().subscribe({
            next: ({
                posibleAhorro,
                nivel,
                siguienteNivel,
                ahorroSiguienteNivel
            }: any) => {
                this.posibleAhorro = posibleAhorro;
                this.nivel = nivel;
                this.siguienteNivel = siguienteNivel;
                this.ahorroSiguienteNivel = ahorroSiguienteNivel;
            }
        });
    }

    guia() {
        this.shepherdService.defaultStepOptions = {
            scrollTo: false,
            cancelIcon: {
                enabled: false
            }
        };
        this.shepherdService.modal = true;
        this.shepherdService.confirmCancel = true;
        this.shepherdService.addSteps([
            {
                id: 'intro1',
                attachTo: {
                    element: '.nombre',
                    on: 'bottom'
                },
                buttons: [
                    {
                        classes: 'btn btn-light',
                        text: 'Atras',
                        disabled() {
                            return true;
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: '!Bienvenido¡ Nos da gusto verte por acá...',
                classes: 'text-principal',
                text: [
                    'En este primer paso, te mostraremos cómo explorar el menú principal.'
                ],
                arrow: true
            },
            {
                id: 'intro2',
                attachTo: {
                    element: '.nombre',
                    on: 'bottom'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: '!Bienvenido¡ Nos da gusto verte por acá...',
                classes: 'text-principal',
                text: [
                    'El menú principal se encuentra en la parte izquierda de la pantalla y te proporciona acceso a las diferentes secciones y funcionalidades de la aplicación.'
                ],
                arrow: true
            },
            {
                id: 'intro3',
                attachTo: {
                    element: '.nombre',
                    on: 'bottom'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: '!Bienvenido¡ Nos da gusto verte por acá...',
                classes: 'text-principal',
                text: [
                    'Tómate tu tiempo para familiarizarte con las opciones del menú y cómo se organizan.'
                ],
                arrow: true
            },
            {
                id: 'menu1',
                attachTo: {
                    element: '.main-sidebar',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde las distintas opciones de este menú puedes acceder a las características del sistema.'
                ],
                arrow: true
            },
            {
                id: 'menu2',
                attachTo: {
                    element: '.menu-item0',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes volver al panel principal y ver un resumen de tus ingresos, gastos y ahorros.'
                ],
                arrow: true
            },
            {
                id: 'menu3',
                attachTo: {
                    element: '.menu-item1',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes registrar tus ingresos del mes en actual y proyectar tus ingresos fijos.'
                ],
                arrow: true
            },
            {
                id: 'menu4',
                attachTo: {
                    element: '.menu-item2',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes ordenar tus gastos en un presupuesto mensual para no sobrepasarte.'
                ],
                arrow: true
            },
            {
                id: 'menu5',
                attachTo: {
                    element: '.menu-item3',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes registrar tus gastos ordenados por categorías.'
                ],
                arrow: true
            },
            {
                id: 'menu5',
                attachTo: {
                    element: '.menu-item4',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes registrar tu deuda financiera, tus tarjetas de crédito y tus cuentas corrientes para realizar un análisis de tu situación financiera.'
                ],
                arrow: true
            },
            {
                id: 'menu6',
                attachTo: {
                    element: '.menu-item5',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes programar una meta de ahorro para saber cuanto debes ahorrar mensualmente.'
                ],
                arrow: true
            },
            {
                id: 'menu7',
                attachTo: {
                    element: '.menu-item6',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes visualizar tus indicadores financieros de corto y largo plazo. Además, puedes obtener una recomendación para mejorar tus indicadores.'
                ],
                arrow: true
            },
            {
                id: 'menu8',
                attachTo: {
                    element: '.menu-item7',
                    on: 'right'
                },
                /* when: {
                  show: () => {
                    this.loading2 = false;
                  },
                  hide: () => {
                    console.log('hide step');
                  }
                }, */
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes simular un crédito bancario y visualizar cómo afecta tus indicadores en el futuro.'
                ],
                arrow: true
            },
            {
                id: 'menu9',
                attachTo: {
                    element: '.menu-item8',
                    on: 'right'
                },
                when: {
                    show: () => {
                        this.loading2 = false;
                    },
                    hide: () => {
                        this.loading2 = false;
                    }
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Atras',
                        action() {
                            return this.back();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action() {
                            return this.next();
                        }
                    }
                ],
                cancelIcon: {
                    enabled: false
                },
                title: 'Tour por las opciones del menú',
                classes: 'text-principal',
                text: [
                    'Desde esta opción puedes acceder a nuestras publicaciones y tips sobre finanzas personales.'
                ],
                arrow: true
            }
        ]);
        this.loading2 = true;
        this.shepherdService.start();
    }
}
