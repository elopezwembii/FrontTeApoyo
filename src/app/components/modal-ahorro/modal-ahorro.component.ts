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
    myModal: any;

    form: FormGroup = this.fb.group({
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
    }

    openModal() {
        this.myModal.show();
    }

    submit() {
        if (!this.form.valid) return;

        const {value: ahorro} = this.form;

        this.ahorroService.agregarAhorro(ahorro).subscribe({
            next: (resp: any) => {
                this.toastr.success(`Ahorro correctamente`);
                this.myModal.hide();
            },
            error: (resp: any) => {
                this.toastr.error('Error');
                console.error(resp);
            }
        });
    }
}
