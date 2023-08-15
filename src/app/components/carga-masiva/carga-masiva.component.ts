import {UsuarioService} from '@services/usuario.service';
import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {environment} from 'environments/environment';

@Component({
    selector: 'app-carga-masiva',
    templateUrl: './carga-masiva.component.html',
    styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent {
    miForm = this.fb.group({
        excel: [, [Validators.required]]
    });

    selectedFile: File = null;
    errores: any[] = [];
    empresa = JSON.parse(sessionStorage.getItem('user')).user.id_empresa;

    constructor(
        private fb: FormBuilder,
        private usuarioService: UsuarioService
    ) {}

    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
    }

    async submitFile() {
        this.errores = []; // Limpia los errores anteriores cada vez que intentes enviar.

        if (this.selectedFile) {
            const formData = new FormData();
            formData.append(
                'archivo',
                this.selectedFile,
                this.selectedFile.name
            );

            formData.append('empresa', this.empresa);

            this.usuarioService.cargaMasiva(formData).subscribe({
                next: (response: any) => {
                    if (response.success) {
                        // Aquí puedes mostrar un mensaje de éxito o hacer alguna otra acción.
                    } else if (
                        response.errors &&
                        Array.isArray(response.errors)
                    ) {
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
}
