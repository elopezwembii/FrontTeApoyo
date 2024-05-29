import {UsuarioService} from '@services/usuario.service';
import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {environment} from 'environments/environment';
import {EmpresaService} from '@services/empresa.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-carga-masiva',
    templateUrl: './carga-masiva.component.html',
    styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent {

    @Output() OnReload: EventEmitter<any[]> = new EventEmitter();

    miForm = this.fb.group({
        excel: [, [Validators.required]],
        empresa: [1]
    });

    selectedFile: File = null;
    errores: any[] = [];
    empresa = JSON.parse(sessionStorage.getItem('user')).user.id_empresa;
    rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
    listaEmpresa: any[] = [];

    constructor(
        private fb: FormBuilder,
        private usuarioService: UsuarioService,
        private empresaService: EmpresaService,
        private toastr: ToastrService,
    ) {
        this.obtenerEmpresas();
    }

    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
    }

    async submitFile() {
        this.errores = []; // Limpia los errores anteriores cada vez que intentes enviar.

        if(!this.miForm.valid) return

        if (this.selectedFile) {
            const formData = new FormData();
            formData.append(
                'archivo',
                this.selectedFile,
                this.selectedFile.name
            );

            if (this.rol === 'Administrador') {
                let empresaValue = this.miForm.get('empresa').value;
                formData.append('empresa', empresaValue.toString());
            } else {
                formData.append('empresa', this.empresa);
            }

            this.usuarioService.cargaMasiva(formData).subscribe({
                next: (response: any) => {
                    if (response.success) {
                        // Aquí puedes mostrar un mensaje de éxito o hacer alguna otra acción.
                        this.miForm.reset();
                        this.OnReload.emit();
                        this.toastr.info('Carga masiva procesada con éxito.');
                    } else if (
                        response.errors &&
                        Array.isArray(response.errors)
                    ) {
                        this.miForm.reset();
                        this.errores = response.errors;
                    } else if (response.message) {
                        // Mostrar el mensaje de error específico que te devuelve el backend
                        alert(
                            'Error no existe una empresa asociada a tu cuenta, contacta con el administrador'
                        );
                    }
                },
                error: (err) => {
                    console.error('Ocurrió un error:', err);
                    // Aquí puedes manejar los errores de red o de otro tipo.
                }
            });
        }
    }

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
            }
        });
    }
}
