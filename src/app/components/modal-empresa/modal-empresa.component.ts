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
        rut: [, [Validators.required]], // Agregado: RUT
        nombres: [, [Validators.required]], // Agregado: Nombres
        apellidos: [, [Validators.required]], // Agregado: Apellidos
        email: [, [Validators.required, Validators.email]],
        password: [, [Validators.required]],
        confirmPassword: [, [Validators.required]], // Agregado: Confirmar Contraseña
        nombreEmpresa: [, [Validators.required]],
        cantidad_colaboradores: [0, [Validators.required, Validators.min(1)]]
    }, {validators: this.passwordsMatch});

    passwordsMatch(group: FormGroup) {
        const password = group.get('password').value;
        const confirmPassword = group.get('confirmPassword').value;
    
        return password === confirmPassword ? null : {notMatching: true};
    }

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

    getFormErrors(): string[] {
        let errors: string[] = [];
        
        if (this.form.get('rut').errors?.required) errors.push('RUT es requerido.');
        if (this.form.get('nombres').errors?.required) errors.push('Nombre es requerido.');
        if (this.form.get('apellidos').errors?.required) errors.push('Apellidos son requeridos.');
        if (this.form.get('email').errors?.required) errors.push('Email es requerido.');
        if (this.form.get('email').errors?.email) errors.push('Formato de email inválido.');
        if (this.form.get('password').errors?.required) errors.push('Contraseña es requerida.');
        if (this.form.get('confirmPassword').errors?.required) errors.push('Confirmación de contraseña es requerida.');
        if (this.form.get('nombreEmpresa').errors?.required) errors.push('Nombre empresa es obligatorio');
        if (this.form.get('cantidad_colaboradores').errors?.required) errors.push('La cantidad de colaboradores es obligatoria');
        if (this.form.errors?.notMatching) errors.push('Contraseña y su confirmación no coinciden.');
        
        return errors;
    }
    
}
