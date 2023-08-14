import { UsuarioService } from '@services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'environments/environment';

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

    constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private http: HttpClient) {}

    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
    }

    async submitFile() {
        if (this.selectedFile) {
    
            const formData = new FormData();
            formData.append('archivo', this.selectedFile, this.selectedFile.name);

            console.log(formData);
            
        
            this.usuarioService.cargaMasiva(formData).subscribe({
                next: data => {
                    console.log(data);
                }
            });
        }
    }
}
