import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import {UsuarioService} from '@services/usuario.service';
import {EmpresaService} from '@services/empresa.service';

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
    rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
    listaEmpresa: any[] = [];
    user: any;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private usuarioService: UsuarioService,
        private empresaService: EmpresaService
    ) {}

    ngOnInit(): void {
        this.obtenerEmpresas();

        this.myModal = new bootstrap.Modal(
            document.getElementById('modalAhorro'),
            {}
        );
    }

    // async obtenerEmpresas() {

    //     const { user: { id_empresa: empresa, id: id_user }, rol: { nombre: rol } } = JSON.parse(sessionStorage.getItem('user'));

    //     (await this.empresaService.getEmpresas()).subscribe({
    //         next: ({empresas}: {empresas: any}) => {
    //             this.listaEmpresa = empresas;
    //             console.log('g',this.listaEmpresa);

    //         },
    //         error: (error: any) => {
    //             this.loading.emit(false);
    //         }
    //     });
    // }

    async obtenerEmpresas() {
        const {
            user: {id_empresa: empresa, id: id_user},
            rol: {nombre: rol, id: id_rol}
        } = JSON.parse(sessionStorage.getItem('user'));

        (await this.empresaService.getEmpresas()).subscribe({
            next: ({empresas}: {empresas: any}) => {
                // Si el rol es administrador (rol 3), mostrar todas las empresas
                if (rol === 'Administrador') {
                    this.listaEmpresa = empresas;
                } else {
                    // Filtrar la lista de empresas por su ID
                    this.listaEmpresa = empresas.filter(
                        (empresaItem: any) => empresaItem.id === empresa
                    );
                }
            },
            error: (error: any) => {
                this.loading.emit(false);
            }
        });
    }

    form: FormGroup = this.fb.group(
        {
            email: [, [Validators.required, Validators.email]],
            password: [, [Validators.required]],
            empresa: [, [Validators.required]],
            rut: [, [Validators.required]], // Asegúrate de validar el RUT adecuadamente
            nombre: [, [Validators.required]],
            apellidos: [, [Validators.required]],
            confirmPassword: [, [Validators.required]]
        },
        {validators: this.passwordsMatch}
    );

    passwordsMatch(group: FormGroup) {
        const password = group.get('password').value;
        const confirmPassword = group.get('confirmPassword').value;

        return password === confirmPassword ? null : {notMatching: true};
    }

    openModal(usuario: any = null) {
        if (usuario === null) {
            if (this.rol === 'Administrador') {
                this.form.reset({
                    email: '',
                    password: '',
                    empresa: '-1'
                });
            } else {
                this.form.reset({
                    email: '',
                    password: '',
                    empresa: JSON.parse(sessionStorage.getItem('user')).user
                        .id_empresa
                });
            }
        } else {
            this.setFormValues(usuario);
        }

        this.myModal.show();
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

    async agregarUsuario(usuario: any) {
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

    async actualizarUsuario(usuario: any) {
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
            this.actualizarUsuario(usuario);
        } else {
            this.agregarUsuario(usuario);
        }
        this.usuarioService.getUsuarios();
    }

    getFormErrors(): string[] {
        let errors: string[] = [];

        if (this.form.get('rut').errors?.required)
            errors.push('RUT es requerido.');
        if (this.form.get('nombre').errors?.required)
            errors.push('Nombre es requerido.');
        if (this.form.get('apellidos').errors?.required)
            errors.push('Apellidos son requeridos.');
        if (this.form.get('email').errors?.required)
            errors.push('Email es requerido.');
        if (this.form.get('email').errors?.email)
            errors.push('Formato de email inválido.');
        if (this.form.get('password').errors?.required)
            errors.push('Contraseña es requerida.');
        if (this.form.get('confirmPassword').errors?.required)
            errors.push('Confirmación de contraseña es requerida.');
        if (this.form.errors?.notMatching)
            errors.push('Contraseña y su confirmación no coinciden.');

        return errors;
    }
    
}
