import {Ahorro, TipoAhorro} from './../../interfaces/ahorro';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AhorroService} from '@services/ahorro/ahorro.service';
import * as bootstrap from 'bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-modal-ahorro',
    templateUrl: './modal-ahorro.component.html',
    styleUrls: ['./modal-ahorro.component.scss']
})
export class ModalAhorroComponent {
    titulo = 'Agregar ahorro';
    myModal: any;
    tipo_ahorro: TipoAhorro[] = [];
    @Input() ahorro: Ahorro[];
    @Output() ahorroMod: EventEmitter<any[]> = new EventEmitter();

    form: FormGroup = this.fb.group({
        id: [,],
        img: [],
        tipo_ahorro: [, [Validators.required]],
        fecha_limite: [, [Validators.required]],
        meta: [, [Validators.required]],
        recaudado: [, [Validators.required]]
    });

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private ahorroService: AhorroService
    ) {}

    ngOnInit() {
        this.myModal = new bootstrap.Modal(
            document.getElementById('modalAhorro'),
            {}
        );

        this.obtenerTipoAhorro();
    }

    openModal(ahorro: Ahorro = null, listAhorro: Ahorro[]) {
        this.myModal.show();
        this.setFormValues(ahorro);
    }

    setFormValues(ahorro: Ahorro) {
        this.titulo = 'Agregar ahorro';
        if (!ahorro) {
            this.form.reset();
            this.form.patchValue({
                tipo_ahorro: '-1'
            });
        } else {
            this.titulo = 'Editar ahorro';

            const fechaISO = ahorro.fecha_limite;
            const fecha = new Date(fechaISO);
            const fechaFormateada = fecha.toISOString().split('T')[0];

            this.form.patchValue({
                id: ahorro.id,
                tipo_ahorro: ahorro.tipo_ahorro,
                fecha_limite: fechaFormateada,
                meta: ahorro.meta,
                recaudado: ahorro.recaudado
            });
        }
    }

    async guardarAhorro(ahorro: Ahorro) {
        /* this.ahorroService.agregarAhorro(ahorro).subscribe({
            complete: () => {
                this.toastr.success(`Ahorro correctamente`);
                this.myModal.hide();
            },
            error: (resp: any) => {
                this.toastr.error('Error');
                console.error(resp);
            }
        }); */
        try {
            const res = await this.ahorroService.agregarAhorro(ahorro);
            this.toastr.success(`Ahorro correctamente`);
            this.obtenerAhorros();

            this.myModal.hide();
        } catch (error) {}
    }

    async obtenerAhorros() {
        (await this.ahorroService.obtenerAhorros()).subscribe({
            next: ({ahorros}: {ahorros: any}) => {
              this.ahorro = ahorros;
              this.ahorroMod.emit(this.ahorro);
            },
            error: (error: any) => {}
        });
    }

    editarAhorro(ahorro: Ahorro) {
        this.ahorroService.editarAhorro(ahorro).subscribe({
            complete: () => {
                this.toastr.success(`Ahorro editado correctamente`);
                this.myModal.hide();
            },
            error: (resp: any) => {
                this.toastr.error('Error');
                console.error(resp);
            }
        });
    }

    obtenerTipoAhorro() {
        this.ahorroService.obtenerTipoAhorro().subscribe({
            next: (tipoAhorro: TipoAhorro[]) => {
                this.tipo_ahorro = tipoAhorro;
            }
        });
    }

    submit() {
        const {value: idAhorro} = this.form.get('tipo_ahorro');
        const tipo_ahorro = this.tipo_ahorro.find(
            (tipo) => tipo.id == idAhorro
        );

        if (!this.form.valid) return;

        let {value: ahorro} = this.form;

        ahorro = {
            ...ahorro,
            tipo_ahorro
        };


        if (ahorro.id) {
            this.editarAhorro(ahorro);
        } else {
            this.guardarAhorro(ahorro);
        }
        this.ahorroService.obtenerAhorros();
    }
}
