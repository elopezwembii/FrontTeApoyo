import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {BienService} from '@services/bien.service';
import {DeudasService} from '@services/deudas.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-crud-bien',
    templateUrl: './crud-bien.component.html',
    styleUrls: ['./crud-bien.component.scss']
})
export class CrudBienComponent implements OnInit {
    isEditing: boolean = false;
    isAdding: boolean = false;
    modal: HTMLElement;
    loading: boolean = false;
    deudas = [];
    tipos_bien = [
        'Ahorro y/o Inversiones',
        'Avalúo Fiscal',
        'Participación en sociedades',
        'Precio de Compraventa'
    ];

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private bienService: BienService
    ) {}

    ngOnInit() {
        this.obtenerDeuda();
    }

    form = this.fb.group({
        id: [''],
        desc: [, [Validators.required]],
        valorado: [, [Validators.required, Validators.min(0)]],
        tipo_valorizacion: [, [Validators.min(1)]],
        tipo_bien: [, [Validators.required, Validators.min(1)]]
    });

    abrirModal(isAdd: boolean, deuda) {
        this.isEditing = !isAdd;
        if (this.isEditing) {
            this.form.patchValue({
                id: deuda.id,
                desc: deuda.desc,
                valorado: deuda.valorado,
                tipo_valorizacion: deuda.tipo_valorizacion,
                tipo_bien: deuda.tipo_valorizacion
            });
        }

        this.modal = document.getElementById('exampleModal');
        this.modal.classList.add('show');
        this.modal.style.display = 'block';
    }

    async obtenerDeuda() {
        this.loading = true;
        (await this.bienService.getBien()).subscribe({
            next: ({deuda}: {deuda: any}) => {
                this.deudas = deuda;
                console.log(deuda);
            },
            error: (error: any) => {}
        });
    }

    async deleteDeuda(deuda: any) {
        if (confirm('¿Estás seguro de eliminar el bien?')) {
            await this.bienService.eliminarDeuda(deuda.id);
            this.obtenerDeuda();
            this.toastr.info('Bien eliminada con éxito.');
        }
    }

    cerrarModal() {
        this.modal.classList.remove('show');
        this.modal.style.display = 'none';
    }

    async update() {
        this.loading = true;
        if (!this.isEditing) {
            const addDeuda = {
                desc: this.form.value.desc!,
                valorado: this.form.value.valorado!,
                tipo_valorizacion: this.form.value.tipo_valorizacion!,
                tipo_bien: this.form.value.tipo_bien!

            };
            try {
                const res = await this.bienService.agregarDeuda(addDeuda);
                this.modal.classList.remove('show');
                this.modal.style.display = 'none';
                if (res) {
                    this.obtenerDeuda();
                    this.toastr.success('Bien agregada con éxito.');
                } else {
                    this.toastr.error('Error al agregar un nuevo bien.');
                    this.loading = false;
                }
            } catch (error) {}
        } else {
            const edit = {
                id: this.form.value.id!,
                desc: this.form.value.desc!,
                valorado: this.form.value.valorado!,
                tipo_valorizacion: this.form.value.tipo_valorizacion!,
                tipo_bien: this.form.value.tipo_bien!
            };
            try {
                await this.bienService.editarDeuda(edit);
                this.modal.classList.remove('show');
                this.modal.style.display = 'none';
                this.obtenerDeuda();
                this.toastr.success('Deuda editada con éxito.');
            } catch (error) {}
        }
        // clean up
        this.isEditing = false;
        this.isAdding = false;
    }
}
