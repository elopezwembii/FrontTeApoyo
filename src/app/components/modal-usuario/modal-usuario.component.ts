import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import {UsuarioService} from '@services/usuario.service';

@Component({
    selector: 'app-modal-usuario',
    templateUrl: './modal-usuario.component.html',
    styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {
    @Input() usuario: any[];
    @Output() loading: EventEmitter<boolean> = new EventEmitter();
    @Output() usuariosMod: EventEmitter<any[]> = new EventEmitter();
    titulo = 'Agregar usuario';
    myModal: any;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private usuarioService: UsuarioService
    ) {}

    ngOnInit(): void {
        this.myModal = new bootstrap.Modal(
            document.getElementById('modalAhorro'),
            {}
        );
    }

    form: FormGroup = this.fb.group({
        email: [, [Validators.required, Validators.email]],
        password: [, [Validators.required]]
    });

    openModal(usuario: any = null) {
        this.myModal.show();
        this.setFormValues(usuario);
    }

    setFormValues(usuario: any) {
        this.titulo = 'Agregar usuario';
        if (!usuario) {
            this.form.reset();
        } else {
            this.titulo = 'Editar usuario';

            this.form.patchValue({});
        }
    }

    async guardarAhorro(usuario: any) {
        this.loading.emit(true);
        try {
            const res = await this.usuarioService.agregarUsuario(usuario);
            this.toastr.success(`Usuario agregado correctamente`);
            this.obtenerUsuarios();
            this.myModal.hide();
        } catch (error) {
            this.loading.emit(false);
        }
    }

    async obtenerUsuarios() {
        (await this.usuarioService.getUsuarios()).subscribe({
            next: ({usuarios}: {usuarios: any}) => {
                this.usuariosMod.emit(usuarios);
                this.loading.emit(false);
            },
            error: (error: any) => {
                this.loading.emit(false);
            }
        });
    }

    async editarAhorro(usuario: any) {
        this.loading.emit(true);

        const res = await this.usuarioService.actualizarUsuario(usuario);
        if (res) {
            this.toastr.success(`Ahorro editado correctamente`);
            this.obtenerUsuarios();
            this.myModal.hide();
        } else {
            this.toastr.error('Error');
        }
    }

    submit() {
        if (!this.form.valid) return;

        let {value: usuario} = this.form;

        usuario = {
            ...usuario
        };

        if (usuario.id) {
            this.editarAhorro(usuario);
        } else {
            this.guardarAhorro(usuario);
        }
        this.usuarioService.getUsuarios();
    }
}
