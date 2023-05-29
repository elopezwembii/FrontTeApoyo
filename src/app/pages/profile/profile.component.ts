import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '@services/app.service';
import {PerfilService} from '@services/perfil/perfil.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    usuario: any;
    familia: any[] = [];

    familiaForm = this.fb.group({
        nombre: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        apellidoMaterno: ['', Validators.required],
        rut: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]]
    });

    form: FormGroup = this.fb.group({
        rut: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        apellidoPaterno: ['', [Validators.required]],
        apellidoMaterno: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        celular: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
        nacionalidad: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
        genero: ['', [Validators.required]]
    });

    constructor(
        private appService: AppService,
        private perfilUsuario: PerfilService,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.usuario = JSON.parse(this.appService.user);
        this.obtenerPerfilUsuario();
        this.obtenerMiembrosFamilia();
    }

    obtenerPerfilUsuario() {
        this.perfilUsuario.obtenerInformacionUsuario().subscribe({
            next: (resp: any) => {
                this.usuario = {
                    ...this.usuario,
                    ...resp
                };

                this.form.patchValue(this.usuario);
            }
        });
    }

    actualizarPerfil() {
        this.perfilUsuario.actualizarPerfil().subscribe({
            next: (resp: boolean) => {
                if (resp) {
                    this.toastr.success('Perfil actualizado correctamente');
                }
            },
            error: (err: any) => {
                this.toastr.error('ERROR,contacte con el administradorr');
                console.log(err);
            }
        });
    }

    submit() {
        if (!this.form.valid) return;
        this.actualizarPerfil();
    }

    agregarMiembro() {
        if (!this.familiaForm.valid) return;

        const nuevoMiembro = {
            nombre: this.familiaForm.value.nombre,
            apellidoPaterno: this.familiaForm.value.apellidoPaterno,
            apellidoMaterno: this.familiaForm.value.apellidoMaterno,
            rut: this.familiaForm.value.rut,
            correo: this.familiaForm.value.correo
        };

        this.perfilUsuario.agregarFamiliar(nuevoMiembro).subscribe({
            next: (resp: any) => {
                this.familiaForm.reset();
            }
        });
    }

    obtenerMiembrosFamilia() {
        this.perfilUsuario.obtenerFamilia().subscribe({
            next: (resp: any) => {
                this.familia = resp;
            }
        });
    }
}
