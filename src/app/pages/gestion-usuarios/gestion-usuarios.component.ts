import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalUsuarioComponent} from '@components/modal-usuario/modal-usuario.component';
import {UsuarioService} from '@services/usuario.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-gestion-usuarios',
    templateUrl: './gestion-usuarios.component.html',
    styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    loading: boolean = false;
    usuarios: any = [];
    @ViewChild('modalUsuario') modalUsuario: ModalUsuarioComponent;
    ngOnInit(): void {
        this.dtOptions = {
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-CL.json'
            }
        };
        this.obtenerUsuarios();
    }

    constructor(
        private usuarioService: UsuarioService,
        private toastr: ToastrService
    ) {}

    async obtenerUsuarios() {
        this.loading = true;
        (await this.usuarioService.getUsuarios()).subscribe({
            next: ({usuarios}: {usuarios: any}) => {
                this.usuarios = usuarios;
                console.log(usuarios);
                this.loading = false;
            },
            error: (error: any) => {}
        });
    }

    openModal(usuario: any = null) {
        this.modalUsuario.openModal(usuario);
    }

    actualizarUsuarios(usuariosMod: any[]) {
        this.obtenerUsuarios();
        console.log(usuariosMod);
    }

    actualizarCarga(loading: boolean) {
        this.loading = loading;
    }

    async cambiarEstado(usuario: any) {
        if (usuario.estado === 1) {
            if (confirm('¿Estás seguro dar de baja al usuario?')) {
                await this.usuarioService.cambiarEstado(usuario);
                this.obtenerUsuarios();
                this.toastr.info('Usuario dado de baja con éxito.');
            }
        }else{
          if (confirm('¿Estás seguro habilitar usuario?')) {
            await this.usuarioService.cambiarEstado(usuario);
            this.obtenerUsuarios();
            this.toastr.info('Usuario habilitado con éxito.');
        }
        }
    }
}
