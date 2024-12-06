import {Gasto} from '@/interfaces/gastos';
import {
    Categoria,
    ItemPresupuesto,
    Presupuesto
} from '@/interfaces/presupuesto';
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import { ModalPresupuestoComponent } from '@components/modal-presupuesto/modal-presupuesto.component';
import {GastosService} from '@services/gastos/gastos.service';
import { ReplicateAll, ReplicateOnly } from '@services/presupuesto/interfaces/presupuesto.interface';
import {PresupuestoService} from '@services/presupuesto/presupuesto.service';
import {ShepherdService} from 'angular-shepherd';
import {ToastrService} from 'ngx-toastr';

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
    itemsPresupuestoAnterior: ItemPresupuesto[] = [];
    presupuestoSelected: ItemPresupuesto = {} as ItemPresupuesto;
    presupuestoAnterior: Presupuesto = {} as Presupuesto;
    @ViewChild('modalPresupuesto') modalPresupuesto: ModalPresupuestoComponent;
    loading: boolean = false;
    user = JSON.parse(sessionStorage.getItem('user')).user.id;
    presupuestoActual: Presupuesto = {} as Presupuesto;

    selectedCategoryIds: number[] = [];
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

    tienePresupuesto=false;

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
        private fb: FormBuilder,
        private presupuestoService: PresupuestoService,
        private gastoService: GastosService,
        private toastr: ToastrService,
        private shepherdService: ShepherdService
    ) {}

    async ngOnInit() {
        this.validaTienePresupuesto();

        this.presupuestoService.obtenerCategoria().subscribe({
            next: (resp: any) => {
                this.categorias = resp;
                console.log(this.categorias)
            }
        });
      
        this.obtenerPresupuesto();
    }

    openModal() {
        this.modalPresupuesto.openModal();
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
                console.log(this.presupuesto)
                this.sumaTotalReal = presupuesto.presupuesto;
                this.itemsPresupuesto = this.presupuesto.get_items;
                this.presupuesto.get_items.map(
                    (item) => (this.presupuestoMonto += item.monto)
                );

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
            complete:()=>{
                this.guia(false);
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

    async obtenerPresupuestoMesAnterior() {
        this.loading = true;
        this.presupuestoMonto = 0;
        
        let previousMonth = this.selectionMonth - 1;
        let previousYear = this.year;
        if (previousMonth < 0) {
            previousMonth = 11;
            previousYear--;
        }
    
        (await this.presupuestoService.getPresupuesto(previousMonth + 1, previousYear)).subscribe({
            next: ({presupuesto}: {presupuesto: Presupuesto}) => {
                this.presupuestoAnterior = presupuesto;
                this.sumaTotalReal = presupuesto.presupuesto;
                this.itemsPresupuestoAnterior = this.presupuestoAnterior.get_items;
    
                this.presupuestoAnterior.get_items.forEach(
                    (item) => (this.presupuestoMonto += item.monto)
                );
    
                // Mapeamos los ítems de presupuesto para generar el gráfico
                this.graficoDonaPresupuesto = this.presupuestoAnterior.get_items.map(
                    (item) => {
                        return {
                            name: this.categorias[item.tipo_gasto - 1].descripcion,
                            value: item.monto
                        };
                    }
                );
    
                this.loading = false;
            },
            complete: () => {
                this.guia(false);
            },
            error: (error: any) => {
                console.log(error);
                this.loading = false;
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

        this.obtenerPresupuesto();
        this.obtenerPresupuestoMesAnterior();
        this.isAdding = false;
        /* this.obtenerDatoGrafico(); */
        if (this.chbMantener) {
            this.chbMantener.nativeElement.checked = false;
        }
    }

    removeMonth() {
        this.selectionMonth--;
        if (this.selectionMonth < 0) {
            this.selectionMonth = 11;
            this.year--;
        }
        this.month = this.arrayMonth[this.selectionMonth];

        this.obtenerPresupuesto();
        this.obtenerPresupuestoMesAnterior();
        this.isAdding = false;
        /* this.obtenerDatoGrafico(); */
        if (this.chbMantener) {
            this.chbMantener.nativeElement.checked = false;
        }
    }


    selectUser(categoria: any) {
        if (!this.presupuestoSelected || this.presupuestoSelected.id !== categoria.id) {
            this.presupuestoSelected = categoria;
            this.isEditing = true;
            this.isAdding = true;
            console.log(categoria)
            this.form.patchValue({
                id: String(categoria.id),
                tipo_gasto: categoria.id,
                monto: String(this.getPresupuesto(categoria.id)?.monto || 0)
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

    async p(itemPresupuesto: ItemPresupuesto, index: number) {
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
                    this.validaTienePresupuesto();
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

        this.presupuestoSelected = {} as ItemPresupuesto;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
        this.form.patchValue({tipo_gasto: 0});
    }

    cancel() {
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

    async mantenerPresupuestoMes(event: any, presupuesto: any) {
        let budgetYearCurrent = this.year
    let budgetMonthCurrent = presupuesto.mes
    let budgetMonthPrevious
    let budgetYearPrevious = this.year
    if(budgetMonthCurrent > 12) {
        budgetMonthCurrent = 1
        budgetYearCurrent = budgetYearCurrent + 1;
    }
    if (budgetMonthCurrent === 1) {
        budgetMonthPrevious = 12;
        budgetYearPrevious = budgetYearCurrent - 1;
    } else {
        budgetMonthPrevious = budgetMonthCurrent - 1;
        budgetYearPrevious = budgetYearCurrent;
    }
        const obj: ReplicateAll = {
            currentMonth: budgetMonthCurrent,
            currentYear: budgetYearCurrent, 
            previousMonth: budgetMonthPrevious,
            previousYear: budgetYearPrevious,  
            userId: this.user
        }
            try {
                const res = await this.presupuestoService.replicarPresupuesto(
                    obj
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
  
    async validaTienePresupuesto() {
        try {
            const { tienePresupuesto }: any = await this.presupuestoService.validaTienePresupuesto().toPromise();
            this.tienePresupuesto = tienePresupuesto;
            console.log('tiene presupuesto variable desde la función', this.tienePresupuesto);
        } catch (error) {
            console.error('Error al obtener el estado del presupuesto:', error);
        }
    }

    getPresupuesto(categoriaId: number) {
        return this.itemsPresupuesto.find(presupuesto => presupuesto.tipo_gasto === categoriaId);
      }

    async guia(clic) {
       await this.validaTienePresupuesto();
        console.log('tiene prespuesto desde la funcion guia',this.tienePresupuesto);
        
        if (this.tienePresupuesto === true && !clic) return; // en el caso que el usuario tenga ya un ingreso se salta el tutorial

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

        //let isTourInicial = localStorage.getItem('tourInicial') === 'realizado';    
        let cancelButtonClass = this.tienePresupuesto ?  'btn btn-light':'btn btn-light d-none' ;

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
                text: ['Acá puedes registrar tus presupuestos del mes']
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
                text: ['Este es el panel donde se muestran los presupuesto que registras']
            },
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

    async guardarPresupuesto(categoria: any, presupuesto: any) {

    let budgetYearCurrent = this.year
    let budgetMonthCurrent = presupuesto.mes + 1
    let budgetMonthPrevious
    let budgetYearPrevious = this.year

    if(budgetMonthCurrent > 12) {
        budgetMonthCurrent = 1
        budgetYearCurrent = budgetYearCurrent + 1;
    }

    if (budgetMonthCurrent === 1) {
        budgetMonthPrevious = 12;
    } else {
        budgetMonthPrevious = budgetMonthCurrent - 1;
        budgetYearPrevious = budgetYearCurrent;
    }

    const filteredItems = presupuesto.get_items.find((item) => item.tipo_gasto === categoria.id)
    
  const objetoGuardar: ReplicateOnly = {
    currentMonth: budgetMonthCurrent,
    currentYear: budgetYearCurrent, 
    previousMonth: budgetMonthPrevious,
    previousYear: budgetYearPrevious,  
    userId: this.user, 
    items: [{
        spendType: categoria.id,
        itemId: filteredItems.id
    }]
  };

  try {
    const res = await this.presupuestoService.replicarUnPresupuesto(
      objetoGuardar
    );
    return res;

} catch (error) {
    this.loading = false;
}

}
}
