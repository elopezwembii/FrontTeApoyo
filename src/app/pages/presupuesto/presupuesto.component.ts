import {Ingreso} from '@/interfaces/ingresos';
import {Categoria, Presupuesto} from '@/interfaces/presupuesto';
import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';
import {PresupuestoService} from '@services/presupuesto/presupuesto.service';
import {ToastrService} from 'ngx-toastr';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-presupuesto',
    templateUrl: './presupuesto.component.html',
    styleUrls: ['./presupuesto.component.scss']
})
export class PresupuestoComponent {
    @ViewChild('chbMantener') chbMantener: ElementRef;
    presupuestoMonto: number = 0;

    categorias: Categoria[] = [];
    presupuestos: Presupuesto[] = [];
    presupuestoSelected: Presupuesto = {} as Presupuesto;

    sumaTotalReal: number = 0;

    ingresoSelected: Ingreso = {} as Ingreso;
    isEditing: boolean = false;
    isAdding: boolean = false;

    presupuesto: any;
    gastoReal: any;

    form = this.fb.group({
        id: [''],
        categoria: ['-1', [Validators.required]],
        mes: [''],
        anio: [''],
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

    public month: string = this.arrayMonth[this.selectionMonth];
    public year: number = this.selectionYear;

    get getFecha() {
        return `${this.year}/${this.selectionMonth + 1}/01`;
    }

    constructor(
        private renderer: Renderer2,
        private fb: FormBuilder,
        private presupuestoService: PresupuestoService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.presupuestoService.obtenerCategoria().subscribe({
            next: (resp: any) => {
                this.categorias = resp;
            }
        });

        this.obtenerDatoGrafico();
        this.obtenerPresupuestoMensual();
        this.obtenerPresupuesto();
    }

    obtenerDatoGrafico() {
        const presupuesto$ = this.presupuestoService.obtenerPresupuesto(
            this.selectionMonth + 1,
            this.selectionYear
        );
        const gastoReal$ = this.presupuestoService.obtenerGastoReal(
            this.selectionMonth + 1,
            this.selectionYear
        );

        forkJoin([presupuesto$, gastoReal$]).subscribe({
            next: ([presupuesto, gastoReal]) => {
                this.presupuesto = presupuesto;
                this.gastoReal = gastoReal;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    obtenerPresupuesto() {
        this.presupuestoService
            .obtenerPresupuestos(this.selectionMonth + 1, this.selectionYear)
            .subscribe({
                next: (resp: any) => {
                    this.presupuestoMonto = this.presupuestoMonto - resp.total;

                    this.presupuestos = resp.presupuestos;
                }
            });
    }

    obtenerPresupuestoMensual() {
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
    }

    addMonth() {
        this.selectionMonth++;
        if (this.selectionMonth > 11) {
            this.selectionMonth = 0;
            this.year++;
        }
        this.month = this.arrayMonth[this.selectionMonth];

        this.obtenerPresupuesto();
        this.obtenerPresupuestoMensual();
        this.obtenerDatoGrafico();
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
        this.obtenerPresupuestoMensual();
        this.obtenerDatoGrafico();
        this.chbMantener.nativeElement.checked = false;
    }

    selectUser(presupuesto: Presupuesto) {
        if (Object.keys(this.presupuestoSelected).length === 0) {
            this.presupuestoSelected = presupuesto;
            this.isEditing = true;
            this.isAdding = true;
            this.form.patchValue({
                id: String(presupuesto.id),
                categoria: presupuesto.categoriaId,
                mes: String(presupuesto.mes),
                anio: String(presupuesto.year),
                monto: String(presupuesto.monto)
            });
        }
    }

    deleteUser(presupuesto: Presupuesto, index: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.presupuestoService
                .eliminarPresupuesto(presupuesto.id)
                .subscribe({
                    next: (resp: any) => {
                        this.presupuestos.splice(index, 1);
                        this.obtenerDatoGrafico();
                        this.obtenerPresupuestoMensual();
                        this.obtenerPresupuesto();
                    }
                });
        }
    }

    generateId() {
        return this.presupuestos.length + 1;
    }

    update() {
        if (!this.isEditing) {
            this.presupuestos[0] = {
                id: this.generateId(),
                categoriaId: this.form.value.categoria,
                categoria: this.form.value.categoria,
                mes: this.selectionMonth + 1,
                year: this.selectionYear,
                monto: parseInt(this.form.value.monto!)
            };

            this.presupuestoService
                .agregarPresupuesto(this.presupuestos[0])
                .subscribe({
                    next: (resp: any) => {
                        this.obtenerPresupuesto();
                        this.obtenerDatoGrafico();
                        this.toastr.success(resp);
                    }
                });
        } else {
            let index = this.presupuestos
                .map((u) => u.id)
                .indexOf(this.presupuestoSelected.id);

            const descripcionCategoria =
                this.presupuestoService.getCategoriaDescripcion(
                    this.form.value.categoria
                );

            this.presupuestos[index] = {
                id: parseInt(this.form.value.id),
                categoriaId: this.form.value.categoria,
                categoria: this.form.value.categoria,
                mes: this.selectionMonth + 1,
                year: this.selectionYear,
                monto: parseInt(this.form.value.monto!)
            };

            this.presupuestoService
                .actualizarPresupuesto(this.presupuestos[index])
                .subscribe({
                    next: (resp: any) => {
                        this.obtenerPresupuesto();
                        this.obtenerDatoGrafico();
                        this.toastr.success(resp);
                    }
                });
        }
        // clean up
        this.presupuestoSelected = {} as Presupuesto;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
        this.form.patchValue({categoria: '-1'});
    }

    cancel() {
        if (
            !this.isEditing &&
            confirm(
                'All unsaved changes will be removed. Are you sure you want to cancel?'
            )
        ) {
            this.presupuestos.splice(0, 1);
        }

        this.presupuestoSelected = {} as Presupuesto;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
    }

    addUser() {
        this.presupuestos.unshift({
            id: null,
            categoria: null,
            categoriaId: null,
            mes: null,
            year: null,
            monto: null
        });

        this.presupuestoSelected = this.presupuestos[0];
        this.isAdding = true;
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }

    mantenerPresupuestoMes(event: any) {
        const {checked} = event.target;

        if (checked) {
            this.presupuestoService
                .obtenerPresupuestos(this.selectionMonth, this.selectionYear)
                .subscribe({
                    next: (resp: any) => {
                        const {presupuestos: data} = resp;

                        if (data.length === 0) {
                            this.toastr.info(
                                `No existe presupuestos en el mes anterior`
                            );
                            this.chbMantener.nativeElement.checked = false;
                            return;
                        }

                        const presupuestosNuevo = data.map((p: any) => {
                            return {
                                ...p,
                                categoria: p.categoriaId,
                                mes: this.selectionMonth + 1,
                                year: this.selectionYear
                            };
                        });

                        this.presupuestos = presupuestosNuevo;
                        this.toastr.success(`Periodo replicado correctamente`);

                        presupuestosNuevo.forEach((element: any) => {
                            this.presupuestoService
                                .agregarPresupuesto(element)
                                .subscribe({
                                    next: (resp: any) => {
                                        this.obtenerPresupuesto();
                                        this.obtenerDatoGrafico();
                                    }
                                });
                        });
                    }
                });
        }
    }
}
