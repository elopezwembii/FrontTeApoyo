import {Ahorro, TipoAhorro} from './../../interfaces/ahorro';
import {Component} from '@angular/core';
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
    tipoAhorro: TipoAhorro[] = [];

    form: FormGroup = this.fb.group({
        id: [,],
        img: [],
        nombre: [, [Validators.required]],
        fechaLimite: [, [Validators.required]],
        monto: [, [Validators.required]],
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

    openModal(ahorro: Ahorro = null) {
        this.myModal.show();
        this.setFormValues(ahorro);
    }

    setFormValues(ahorro: Ahorro) {
        this.titulo = 'Agregar ahorro';
        if (!ahorro) {
            this.form.reset();
            this.form.patchValue({
                nombre: '-1'
            });
        } else {
            this.titulo = 'Editar ahorro';

            const fechaISO = ahorro.fechaLimite;
            const fecha = new Date(fechaISO);
            const fechaFormateada = fecha.toISOString().split('T')[0];

            this.form.patchValue({
                id: ahorro.id,
                nombre: ahorro.tipoAhorro.id,
                fechaLimite: fechaFormateada,
                monto: ahorro.monto,
                meta: ahorro.meta,
                recaudado: ahorro.recaudado
            });
        }
    }

    guardarAhorro(ahorro: Ahorro) {
        this.ahorroService.agregarAhorro(ahorro).subscribe({
            complete: () => {
                this.toastr.success(`Ahorro correctamente`);
                this.myModal.hide();
            },
            error: (resp: any) => {
                this.toastr.error('Error');
                console.error(resp);
            }
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
                this.tipoAhorro = tipoAhorro;
            }
        });
    }

    submit() {
        const {value: idAhorro} = this.form.get('nombre');
        const tipoAhorro = this.tipoAhorro.find((tipo) => tipo.id == idAhorro);

        console.log(tipoAhorro);

        if (!this.form.valid) return;

        let {value: ahorro} = this.form;

        ahorro = {
            ...ahorro,
            tipoAhorro
        };

        if (ahorro.id) {
            this.editarAhorro(ahorro);
        } else {
            this.guardarAhorro(ahorro);
        }
        this.ahorroService.obtenerAhorros().subscribe();
    }
}
