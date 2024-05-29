import {Ingreso} from './../../interfaces/ingresos';
import {Component, OnInit, Renderer2, ElementRef} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {IngresosService} from '@services/ingresos/ingresos.service';
import {ShepherdService} from 'angular-shepherd';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-ingresos',
    templateUrl: './ingresos.component.html',
    styleUrls: ['./ingresos.component.scss']
})
export class IngresosComponent implements OnInit {
    tourStarted = false;
    tourCancelled = false;

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
        [],
        [
            'Se promedian al menos 6 meses de boletas, descontando la retención correspondiente.'
        ],
        ['Normalmente se considera el 100% del canon de arriendo.'],
        [
            'Considera el valor de la línea 170 (Base Imponible Anual) y se le resta el impuesto a pagar, línea 93 (Total a pagar).',
            'El resultado se divide por los 12, para hacer el promedio mensual de ingreso.',
            'Si consideras la Declaración, no puedes ingresar sueldo, ni boletas, al estar ya incluidos en ésta.'
        ],
        ['Considera el total del valor.'],
        ['Considera el total del valor.'],
        ['Considera el total del valor.']
    ];

    get getTipo() {
        return this.form.get('tipo_ingreso').value;
    }

    windowSize: number;

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private ingresoService: IngresosService,
        private toastr: ToastrService,
        private router: Router,
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

    ngOnInit() {
        this.validaTieneIngreso();
        this.obtenerIngresos();
        this.generarDias(this.selectionMonth, this.selectionYear);
    }

    async obtenerIngresos() {
        this.loading = true;
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
                this.sumaTotalReal = sumaTotalReal;
                this.ingresos = ingresos;
                this.change = !this.change;
                this.loading = false;
                this.guia(false);
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
            this.isEditing = true;
            this.isAdding = true;
            this.form.patchValue({
                id: String(ingreso.id),
                desc: ingreso.desc,
                fijar: ingreso.fijar,
                tipo_ingreso: ingreso.tipo_ingreso,
                dia: ingreso.dia,
                mes: String(this.selectionMonth + 1),
                anio: String(this.year),
                montoReal: String(ingreso.monto_real),
                montoPlanificado: String(ingreso.montoPlanificado)
            });
            this.abrirModal();
        }
    }

    async deleteUser(ingreso: Ingreso) {
        if (confirm('¿Estas seguro de eliminar el ingreso?')) {
            await this.ingresoService.eliminarIngreso(ingreso.id);
            this.obtenerIngresos();
            this.toastr.info('Ingreso eliminado con éxito.');
        }
    }

    modal: HTMLElement;

    abrirModal() {
        if (this.windowSize <= 1000) {
            this.modal = document.getElementById('modalAgregarIngreso');
            this.modal.classList.add('show');
            this.modal.style.display = 'block';

            this.nextAccion();
        }
    }

    cerrarModal() {
        if (localStorage.getItem('tourInicial') !== 'realizado') return;

        if (this.windowSize <= 1000) {
            this.modal.classList.remove('show');
            this.modal.style.display = 'none';
            this.ingresoSelected = {} as Ingreso;
            this.isEditing = false;
            this.isAdding = false;
            this.form.reset();
            this.toastr.info('No se realizaron cambios...');
            //this.tourCancelled=true;
            this.cancelAccion();
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
                anio: this.year,
                monto_real: parseInt(this.form.value.montoReal!),
                montoPlanificado: parseInt(this.form.value.montoPlanificado!)
            };

            try {
                const res = await this.ingresoService.agregarIngreso(
                    this.ingresos[0]
                );
                if (this.windowSize <= 1000) {
                    this.modal.classList.remove('show');
                    this.modal.style.display = 'none';
                }
                if (res) {
                    this.obtenerIngresos();
                    this.validaTieneIngreso();
                    this.change = !this.change;
                    this.toastr.success('Ingreso agregado con éxito.');

                    this.nextAccion();
                } else {
                    this.toastr.error('Error al agregar un nuevo ingreso.');
                    this.loading = false;
                }
            } catch (error) {}
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
                mes: this.selectionMonth + 1,
                anio: this.year,
                monto_real: parseInt(this.form.value.montoReal!),
                montoPlanificado: parseInt(this.form.value.montoPlanificado!)
            };
            try {
                await this.ingresoService.actualizarIngreso(
                    this.ingresos[index],
                    this.selectionMonth + 1,
                    this.year
                );
                if (this.windowSize <= 1000) {
                    this.modal.classList.remove('show');
                    this.modal.style.display = 'none';
                }
                this.obtenerIngresos();
                this.change = !this.change;
                this.toastr.success('Ingreso editado con éxito.');
            } catch (error) {}
        }
        // clean up
        this.ingresoSelected = {} as Ingreso;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
    }

    cancel() {
        if (localStorage.getItem('tourInicial') !== 'realizado') return;

        if (!this.isEditing) {
            this.ingresos.pop();
        }

        this.ingresoSelected = {} as Ingreso;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
        this.toastr.info('No se realizaron cambios...');
        this.cancelAccion();
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

        this.nextAccion();
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }
    tieneIngreso = false;

    async validaTieneIngreso() {
        try {
            const {tieneIngresos}: any = await this.ingresoService
                .validaTieneIngreso()
                .toPromise();
            this.tieneIngreso = tieneIngresos;
        } catch (error) {
            console.error('Error al obtener el estado de los ingresos:', error);
        }
    }

    guia(clic) {
        if (this.tieneIngreso === true && !clic) return; // en el caso que el usuario tenga ya un ingreso se salta el tutorial

        this.shepherdService.defaultStepOptions = {
            scrollTo: true,
            cancelIcon: {
                enabled: false
            }
        };
        this.shepherdService.modal = true;
        this.shepherdService.confirmCancel = false;

        if (window.innerWidth <= 768) {
            // Verificar si la pantalla es de tamaño móvil
            this.tourMovil();
        } else {
            this.tourEscritorio();
        }
        this.tourStarted = true;
        this.shepherdService.start();
    }

    tourEscritorio() {
        //let isTourInicial = localStorage.getItem('tourInicial') === 'realizado';
        let cancelButtonClass = this.tieneIngreso //isTourInicial
            ? 'btn btn-light'
            : 'btn btn-light d-none';

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
                            //this.tourCancelled=true;
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
                text: ['Acá puedes registrar tus ingresos del mes']
            },
            {
                id: 'intro2',
                attachTo: {
                    element: '.card-ingreso',
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
                text: [
                    'Este es el panel donde se muestran los ingresos que registras'
                ]
            },
            {
                id: 'intro4',
                attachTo: {
                    element: '.boton-add',
                    on: 'top'
                },
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: [
                    'Comencemos agregando un ingreso. Haz click aquí para poder agregarlo'
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
                text: ['Completa los datos de tu ingreso principal']
            },
            {
                id: 'intro6',
                attachTo: {
                    element: '.card-ingreso',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action: () => {
                            if (this.ingresos.length === 1) {
                                this.router.navigate(['presupuesto']);
                            }
                            this.shepherdService.complete();
                        }
                    }
                ],
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: ['¡Listo! Tu ingreso ha sido registrado']
            }
        ]);
    }

    tourMovil() {
        this.shepherdService.addSteps([
            {
                id: 'intro1',
                attachTo: {
                    element: '.text-main',
                    on: 'bottom'
                },
                buttons: [
                    {
                        classes: 'btn btn-light',
                        text: 'Cancelar',
                        action: () => this.shepherdService.cancel()
                    },
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action: () => this.shepherdService.next()
                    }
                ],
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: ['Acá puedes registrar tus ingresos del mes']
            },
            {
                id: 'intro2',
                attachTo: {
                    element: '.card-ingreso',
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
                text: [
                    'Este es el panel donde se muestran los ingresos que registras'
                ]
            },
            {
                id: 'intro4',
                attachTo: {
                    element: '.boton-add',
                    on: 'top'
                },
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: [
                    'Comencemos agregando un ingreso. Haz click aquí para poder agregarlo.'
                ]
            },
            {
                id: 'intro5',
                attachTo: {
                    element: '.red',
                    on: 'top'
                },
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: ['Completa los datos de tu ingreso principal']
            },
            {
                id: 'intro6',
                attachTo: {
                    element: '.card-ingreso',
                    on: 'right'
                },
                buttons: [
                    {
                        classes: 'shepherd-button-primary',
                        text: 'Siguiente',
                        action: () => {
                            if (this.ingresos.length === 1) {
                                this.router.navigate(['presupuesto']);
                            }
                            this.shepherdService.complete();
                        }
                    }
                ],
                classes: 'shepherd shepherd-open shepherd-theme-arrows',
                text: ['¡Listo! Tu ingreso ha sido registrado']
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
