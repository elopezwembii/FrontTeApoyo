import {Gasto} from '@/interfaces/gastos';
import {Ingreso} from '@/interfaces/ingresos';
import {
    Categoria,
    ItemPresupuesto,
    Presupuesto
} from '@/interfaces/presupuesto';
import {
    Component,
    ElementRef,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import {GastosService} from '@services/gastos/gastos.service';
import {PresupuestoService} from '@services/presupuesto/presupuesto.service';
import {ShepherdService} from 'angular-shepherd';
import {ToastrService} from 'ngx-toastr';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-presupuesto',
    templateUrl: './presupuesto.component.html',
    styleUrls: ['./presupuesto.component.scss']
})
export class PresupuestoComponent implements OnInit {
    tourStarted = false;
    tourCancelled = false;

    @ViewChild('chbMantener') chbMantener: ElementRef;
    presupuestoMonto: number = 0;

    categorias: Categoria[] = [];
    presupuesto: Presupuesto = {} as Presupuesto;
    itemsPresupuesto: ItemPresupuesto[] = [];
    presupuestoSelected: ItemPresupuesto = {} as ItemPresupuesto;
    loading: boolean = false;

    sumaTotalReal: number = 0;

    isEditing: boolean = false;
    isAdding: boolean = false;
    graficoDonaPresupuesto: any;
    gastosGraficoBarra: any;

    form = this.fb.group({
        id: [''],
        tipo_gasto: [0, [Validators.required]],
        monto: ['', [Validators.required, Validators.min(0)]]
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

    opcionesSelect2 = {
        1: [
            'Artículos para el hogar, Mascotas, Limpieza y mantenimiento, Gasto común, Arriendo o dividendo, Asesora del hogar/niñera/cuidadora, Seguro del hogar, Otros gastos del hogar'
        ],
        2: ['Agua, Luz, Gas, Cable/Internet, Alarma, Telefonía'],
        3: [
            'Supermercado, Feria, Agua en botellón, Antojos (bebida, agua, café, snacks), Comida rápida, Gastos en delivery y propinas, Otros alimentos'
        ],
        4: [
            'Juguetes y videojuegos, Suscripciones y apps, Bares, pubs, restaurantes, Espectáculos y eventos, Otros entretenimientos'
        ],
        5: [
            'Perfumes y cosméticos, Salón de belleza/Barbería, Médico/Dentista, Gimnasio (mensual), Arriendo de canchas (deporte), Farmacia, Cuidado personal/Terapias, Otros gastos de salud y belleza'
        ],
        6: [
            'Mantenimiento y reparaciones, Autolavado, Transporte público, Gasolina, Taxi-Uber-Didi, Peajes/Autopistas, Estacionamiento diario, Estacionamiento mensual, Seguro, Otros gastos de auto y transporte'
        ],
        7: [
            'Servicios legales/contables, Otros gastos de educación y trabajo, Colegiatura, Academias/Cuotas de curso, Artículos de librería/escritorio, Transporte escolar, Otros gastos de educación y trabajo'
        ],
        8: [
            'Donaciones, Apoyo a familiares y amigos, Regalos, Otros gastos de regalos y ayuda'
        ],
        9: ['Hospedaje, Vuelos, Otros gastos de viajes'],
        10: [
            'Casas comerciales, Créditos de consumo, Crédito automotriz, Tarjeta de crédito, Línea de crédito, Otros pagos de créditos'
        ],
        11: [
            'Calzado, Accesorios, Lavandería y tintorería, Ropa, Otros gastos de ropa y calzado'
        ],
        12: [
            'Impuestos, Pago de pensión de alimentos, Seguros de vida, Alcohol, Tabaco, Juegos de azar/Apuestas online'
        ],
        13: [
            'AliExpress/Shein, Grandes tiendas/Mercado libre, Otras compras online'
        ],
        14: [
            'Ahorro para celebraciones, Ahorro para cumpleaños, Ahorro para educación, Ahorro para fiestas patrias, Ahorro para fin de semana largo, Ahorro para Navidad/Año Nuevo, Ahorro para viajes/vacaciones, Fondo de emergencia, Ahorro general (varios), Inversiones y Acciones'
        ]
    };

    public month: string = this.arrayMonth[this.selectionMonth];
    public year: number = this.selectionYear;

    get getFecha() {
        return `${this.year}/${this.selectionMonth + 1}/01`;
    }

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private presupuestoService: PresupuestoService,
        private gastoService: GastosService,
        private toastr: ToastrService,
        private shepherdService: ShepherdService
    ) {}

    async ngOnInit() {
        this.presupuestoService.obtenerCategoria().subscribe({
            next: (resp: any) => {
                this.categorias = resp;
            }
        });

        /* this.obtenerDatoGrafico(); */
        this.obtenerPresupuesto();
    }
    async obtenerPresupuesto() {
        this.loading = true;
        this.presupuestoMonto = 0;
        (
            await this.presupuestoService.getPresupuesto(
                this.selectionMonth + 1,
                this.year
            )
        ).subscribe({
            next: ({presupuesto}: {presupuesto: Presupuesto}) => {
                this.presupuesto = presupuesto;
                this.sumaTotalReal = presupuesto.presupuesto;
                this.itemsPresupuesto = this.presupuesto.get_items;
                this.presupuesto.get_items.map(
                    (item) => (this.presupuestoMonto += item.monto)
                );
                this.guia(false);

                this.graficoDonaPresupuesto = this.presupuesto.get_items.map(
                    (item) => {
                        return {
                            name: this.categorias[item.tipo_gasto - 1]
                                .descripcion,
                            value: item.monto
                        };
                    }
                );

                this.loading = false;
            },
            error: (error: any) => {
                console.log(error);
            }
        });
        (
            await this.gastoService.getGasto(this.selectionMonth + 1, this.year)
        ).subscribe({
            next: ({
                gastos,
                sumaTotalReal
            }: {
                gastos: Gasto[];
                sumaTotalReal: number;
            }) => {
                let gastosNoRepetido;
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
                this.gastosGraficoBarra = gastosNoRepetido.map((gasto) => {
                    return {
                        name: this.categorias[gasto.tipo_gasto - 1].descripcion,
                        value: gasto.monto
                    };
                });
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    /* obtenerPresupuestoMensual() {
        this.presupuestoService
            .obtenerPresupuestoMensual(
                this.selectionMonth + 1,
                this.selectionYear
            )
            .subscribe({
                next: (resp: any) => {
                    this.presupuestoMonto = resp;
                }
            });
    } */

    addMonth() {
        this.selectionMonth++;
        if (this.selectionMonth > 11) {
            this.selectionMonth = 0;
            this.year++;
        }
        this.month = this.arrayMonth[this.selectionMonth];

        this.obtenerPresupuesto();
        this.isAdding = false;
        /* this.obtenerDatoGrafico(); */
        this.chbMantener.nativeElement.checked = false;
    }

    removeMonth() {
        this.selectionMonth--;
        if (this.selectionMonth < 0) {
            this.selectionMonth = 11;
            this.year--;
        }
        this.month = this.arrayMonth[this.selectionMonth];

        this.obtenerPresupuesto();
        this.isAdding = false;
        /* this.obtenerDatoGrafico(); */
        this.chbMantener.nativeElement.checked = false;
    }

    selectUser(itemPresupuesto: ItemPresupuesto) {
        if (Object.keys(this.presupuestoSelected).length === 0) {
            this.presupuestoSelected = itemPresupuesto;
            this.isEditing = true;
            this.isAdding = true;
            this.form.patchValue({
                id: String(itemPresupuesto.id),
                tipo_gasto: itemPresupuesto.tipo_gasto,
                monto: String(itemPresupuesto.monto)
            });
        }
    }

    async deleteUser(itemPresupuesto: ItemPresupuesto, index: number) {
        if (confirm('¿Estas seguro de eliminar el item?')) {
            await this.presupuestoService.eliminarItem(itemPresupuesto.id);
            this.obtenerPresupuesto();
            this.toastr.info('Ítem eliminado con éxito');
        }
    }

    generateId() {
        return this.itemsPresupuesto.length + 1;
    }

    async update() {
        this.loading = true;
        if (!this.isEditing) {
            this.itemsPresupuesto[0] = {
                id: this.generateId(),
                tipo_gasto: this.form.value.tipo_gasto,
                monto: parseInt(this.form.value.monto!),
                id_presupuesto: this.presupuesto.id
            };

            try {
                const res = await this.presupuestoService.agregarPresupuesto(
                    this.itemsPresupuesto[0]
                );
                if (res) {
                    this.obtenerPresupuesto();
                    this.toastr.success('Presupuesto agregado con éxito.');
                    this.nextAccion();
                } else {
                    this.toastr.error('Error al agregar presupuesto.');
                    this.loading = false;
                }
            } catch (error) {}
        } else {
            let index = this.itemsPresupuesto
                .map((u) => u.id)
                .indexOf(this.presupuestoSelected.id);

            this.itemsPresupuesto[index] = {
                id: parseInt(this.form.value.id),
                tipo_gasto: this.form.value.tipo_gasto,
                monto: parseInt(this.form.value.monto!),
                id_presupuesto: this.presupuesto.id
            };

            try {
                const res = await this.presupuestoService.agregarPresupuesto(
                    this.itemsPresupuesto[index]
                );
                if (res) {
                    this.obtenerPresupuesto();
                    this.toastr.success('Presupuesto editado con éxito.');
                } else {
                    this.toastr.error('Error al editar presupuesto.');
                    this.loading = false;
                }
            } catch (error) {}
        }
        // clean up
        this.presupuestoSelected = {} as ItemPresupuesto;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
        this.form.patchValue({tipo_gasto: 0});
    }

    cancel() {
        // if (
        //     !this.isEditing &&
        //     confirm(
        //         'All unsaved changes will be removed. Are you sure you want to cancel?'
        //     )
        // ) {
        //     this.itemsPresupuesto.splice(0, 1);
        // }

        if (localStorage.getItem('tourInicial') !== 'realizado') return;

        if (!this.isEditing) {
            this.itemsPresupuesto.pop();
        }

        this.presupuestoSelected = {} as ItemPresupuesto;
        this.isEditing = false;
        this.isAdding = false;
        this.toastr.info('No se realizaron cambios...');
        this.form.reset();
        this.cancelAccion();
    }

    addUser() {
        this.itemsPresupuesto.push({
            id: null,
            tipo_gasto: null,
            monto: null,
            id_presupuesto: null
        });

        this.presupuestoSelected =
            this.itemsPresupuesto[this.itemsPresupuesto.length - 1];
        this.isAdding = true;

        this.nextAccion();
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }

    async mantenerPresupuestoMes(event: any) {
        const {checked} = event.target;
        let mes_actual = this.selectionMonth + 1;
        let anio_actual = this.selectionYear;
        let mes_anterior, anio_anterior;
        if (mes_actual === 1) {
            mes_anterior = 12;
            anio_anterior = anio_actual - 1;
        } else {
            mes_anterior = mes_actual - 1;
            anio_anterior = anio_actual;
        }
        this.loading = true;
        if (checked) {
            try {
                const res = await this.presupuestoService.replicarPresupuesto(
                    mes_actual,
                    anio_actual,
                    mes_anterior,
                    anio_anterior
                );
                if (res) {
                    this.obtenerPresupuesto();
                    this.toastr.success('Presupuesto clonado con éxito.');
                } else {
                    this.toastr.error('Error al clonar presupuesto.');
                    event.target.checked = false;
                    this.loading = false;
                }
            } catch (error) {
                this.toastr.error('Error al clonar presupuesto.');
                this.loading = false;
            }
        }
    }

    guia(clic) {
        if (this.itemsPresupuesto.length !== 0 && !clic) return; // en el caso que el usuario tenga ya un ingreso se salta el tutorial

        this.shepherdService.defaultStepOptions = {
            scrollTo: false,
            cancelIcon: {
                enabled: false
            }
        };
        this.shepherdService.modal = true;
        this.shepherdService.confirmCancel = false;
        this.tourEscritorio();
        this.tourStarted = true;
        this.shepherdService.start();
    }

    tourEscritorio() {

        let isTourInicial = localStorage.getItem('tourInicial') === 'realizado';    
        let cancelButtonClass = isTourInicial ?  'btn btn-light':'btn btn-light d-none' ;

        this.shepherdService.addSteps([
            {
                id: 'intro1',
                attachTo: {
                    element: '.text-main',
                    on: 'bottom'
                },
                buttons: [
                    {
                        classes: cancelButtonClass,
                        text: 'Cancelar',
                        action: () => {
                            this.cancelAccion();
                        }
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action: () => this.shepherdService.next()
                    }
                ],
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: ['Esta es la pagina de tus presupuestos']
            },
            {
                id: 'intro2',
                attachTo: {
                    element: '.card-presupuesto',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'btn btn-light',
                        text: 'Atras',
                        action: () => this.shepherdService.back()
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action: () => this.shepherdService.next()
                    }
                ],
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: ['Este es el panel de tus presupuestos']
            },
            {
                id: 'intro4',
                attachTo: {
                    element: '.boton-add',
                    on: 'top'
                },
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: [
                    'Comencemos agregando un presupuesto, haz clic aquí para poder agregar un presupuesto'
                ]
            },
            {
                id: 'intro5',
                attachTo: {
                    element: '.red',
                    on: 'right'
                },
                beforeShowPromise: () => {
                    return new Promise((resolve) => {
                        setTimeout(resolve, 500);
                    });
                },
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: [
                    'Completa con los datos para poder agregar el presupuesto'
                ]
            },
            {
                id: 'intro6',
                attachTo: {
                    element: '.card-presupuesto',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Terminar',
                        action: () => {
                            //TODO: verificar si ya tiene presupuesto
                            localStorage.setItem('tourInicial', 'realizado');
                            this.shepherdService.complete();
                        }
                    }
                ],
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: ['Finalmente se agrego el presupuesto']
            }
        ]);
    }

    nextAccion() {
        if (this.tourStarted == true && this.tourCancelled == false) {
            this.tourCancelled = false;
            this.shepherdService.next();
        }
    }

    cancelAccion() {
        this.tourStarted = false;
        this.tourCancelled = true;
        if (this.tourStarted == false && this.tourCancelled == true) {
            this.tourCancelled = false;
            this.shepherdService.cancel();
        }
    }
}
