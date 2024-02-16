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
    rol: string;
    familia: any[] = [];
    loading: boolean = false;

    familiaForm = this.fb.group({
        nombre: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        apellidoMaterno: ['', Validators.required],
        rut: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]]
    });

    seguridadForm = this.fb.group({
        id: [''],
        actual: ['', Validators.required],
        nueva: ['', Validators.required],
        confirme: ['', Validators.required]
    });

    form: FormGroup = this.fb.group({
        rut: [''],
        nombres: [''],
        apellidos: [''],
        email: ['', [Validators.email]],
        celular: [''],
        direccion: [''],
        ciudad: [''],
        nacionalidad: [''],
        fecha_nacimiento: [''],
        genero: [null]
    });

    constructor(
        private appService: AppService,
        private perfilUsuario: PerfilService,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.usuario = JSON.parse(this.appService.user);
        this.rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
        this.obtenerPerfilUsuario();
        this.obtenerMiembrosFamilia();
    }

    async obtenerPerfilUsuario() {
        this.loading = true;
        (await this.perfilUsuario.obtenerInformacionUsuario()).subscribe({
            next: ({perfil}: {perfil: any}) => {
                this.usuario = perfil;
                this.form.patchValue({
                    rut: perfil.rut,
                    nombres: perfil.nombres,
                    apellidos: perfil.apellidos,
                    email: perfil.email,
                    telefono: perfil.telefono,
                    direccion: perfil.direccion,
                    ciudad: perfil.ciudad,
                    nacionalidad: perfil.nacionalidad,
                    fecha_nacimiento: perfil.fecha_nacimiento,
                    genero: perfil.genero
                });
                this.loading = false;
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    }

    async actualizarPerfil() {
        this.loading = true;
        this.usuario.nombres = this.form.value.nombres!;
        this.usuario.rut = this.form.value.rut!;
        this.usuario.apellidos = this.form.value.apellidos!;
        this.usuario.email = this.form.value.email!;
        this.usuario.telefono = this.form.value.telefono!;
        this.usuario.direccion = this.form.value.direccion!;
        this.usuario.ciudad = this.form.value.ciudad!;
        this.usuario.nacionalidad = this.form.value.nacionalidad!;
        this.usuario.fecha_nacimiento = this.form.value.fecha_nacimiento!;
        this.usuario.genero = this.form.value.genero!;
        try {
            await this.perfilUsuario.actualizarPerfil(this.usuario);
            this.obtenerPerfilUsuario();
            this.toastr.success('Perfil editado con éxito.');
        } catch (error) {}
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

    actuallizarClaves() {
        if (!this.seguridadForm.valid) return;
        this.seguridadForm.value.id = this.usuario.id;

        this.perfilUsuario.actualClaves(this.seguridadForm.value).subscribe({
            next: (resp: any) => {
                if(resp.body.code == 200){
                    this.toastr.success(resp.body.message);
                    this.seguridadForm.reset();
                }else{
                    this.toastr.error(resp.body.message); 
                }
                
            }
        });

    }

}
