import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import {EmpresaService} from '@services/empresa.service';

@Component({
    selector: 'app-modal-empresa',
    templateUrl: './modal-empresa.component.html',
    styleUrls: ['./modal-empresa.component.scss']
})
export class ModalEmpresaComponent implements OnInit {
    @Input() empresa: any[];
    @Output() loading: EventEmitter<boolean> = new EventEmitter();
    @Output() empresasMod: EventEmitter<any[]> = new EventEmitter();
    titulo = 'Agregar empresa';
    myModal: any;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private empresaService: EmpresaService
    ) {}

    ngOnInit(): void {
        this.myModal = new bootstrap.Modal(
            document.getElementById('modalAhorro'),
            {}
        );
    }

    form: FormGroup = this.fb.group({
        email: [, [Validators.required, Validators.email]],
        password: [, [Validators.required]],
        nombre: [, [Validators.required]],
        cantidad_colaboradores: [0, [Validators.required, Validators.min(1)]]
    });

    openModal(empresa: any = null) {
        this.myModal.show();
        this.setFormValues(empresa);
    }

    setFormValues(empresa: any) {
        this.titulo = 'Agregar empresa';
        if (!empresa) {
            this.form.reset();
        } else {
            this.titulo = 'Editar empresa';

            this.form.patchValue({});
        }
    }

    async obtenerEmpresas() {
        (await this.empresaService.getEmpresas()).subscribe({
            next: ({empresas}: {empresas: any}) => {
                this.empresasMod.emit(empresas);
                this.loading.emit(false);
            },
            error: (error: any) => {
                this.loading.emit(false);
            }
        });
    }

    async guardarEmpresa(empresa: any) {
        this.loading.emit(true);
        try {
            const res = await this.empresaService.agregarEmpresa(empresa);
            this.toastr.success(`Usuario agregado correctamente`);
            this.obtenerEmpresas();
            this.myModal.hide();
        } catch (error) {
            this.loading.emit(false);
        }
    }

    /* async guardarAhorro(usuario: any) {
        this.loading.emit(true);
        try {
            const res = await this.usuarioService.agregarUsuario(usuario);
            this.toastr.success(`Usuario agregado correctamente`);
            this.obtenerUsuarios();
            this.myModal.hide();
        } catch (error) {
            this.loading.emit(false);
        }
    } */

    /* async obtenerUsuarios() {
        (await this.usuarioService.getUsuarios()).subscribe({
            next: ({usuarios}: {usuarios: any}) => {
                this.usuariosMod.emit(usuarios);
                this.loading.emit(false);
            },
            error: (error: any) => {
                this.loading.emit(false);
            }
        });
    } */

    /* async editarAhorro(usuario: any) {
        this.loading.emit(true);

        const res = await this.usuarioService.actualizarUsuario(usuario);
        if (res) {
            this.toastr.success(`Ahorro editado correctamente`);
            this.obtenerUsuarios();
            this.myModal.hide();
        } else {
            this.toastr.error('Error');
        }
    } */

    submit() {
        if (!this.form.valid) return;

        let {value: empresa} = this.form;

        empresa = {
            ...empresa
        };

        if (empresa.id) {
            //this.(usuario);
        } else {
            this.guardarEmpresa(empresa);
        }
        this.empresaService.getEmpresas();
    }
}
