import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalUsuarioComponent} from '@components/modal-usuario/modal-usuario.component';
import {EmpresaService} from '@services/empresa.service';
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
    empresa = JSON.parse(sessionStorage.getItem('user')).user.id_empresa;
    rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
    // empresa_desc = JSON.parse(sessionStorage.getItem('user')).user.empresa
    //     .nombre;

    userSession = JSON.parse(sessionStorage.getItem('user'));

    empresa_desc =
        this.userSession &&
        this.userSession.user &&
        this.userSession.user.empresa &&
        this.userSession.user.empresa.nombre
            ? this.userSession.user.empresa.nombre
            : 'sin empresa';

    limiteColaboracion = 0;
    cantidadColaboradores = 0;
    cupoDisponible = false;

    cupo() {
        if (this.empresa_desc === 'sin empresa') return;

        this.empresaService.getCantidadColaboradores(this.empresa).subscribe({
            next: ({
                limiteColaboradores,
                cantidadColaboradores,
                cupoDisponible
            }: any) => {
                this.limiteColaboracion = limiteColaboradores;
                this.cantidadColaboradores = cantidadColaboradores;
                this.cupoDisponible = cupoDisponible;
            }
        });
    }

    constructor(
        private usuarioService: UsuarioService,
        private empresaService: EmpresaService,
        private toastr: ToastrService
    ) {
        // Obtener el usuario y su información desde sessionStorage
    }

    // async obtenerUsuarios() {

    //     const {
    //         user: {id_empresa: empresa},
    //         rol: {nombre: rol}
    //     } = JSON.parse(sessionStorage.getItem('user'));

    //     console.log(rol);
    //     console.log(empresa);

    //     this.loading = true;
    //     (await this.usuarioService.getUsuarios()).subscribe({
    //         next: ({usuarios}: {usuarios: any}) => {
    //             this.usuarios = usuarios;

    //             console.log('list',this.usuarios);

    //             this.loading = false;
    //         },
    //         error: (error: any) => {}
    //     });
    // }

    async obtenerUsuarios() {
        const {
            user: {id_empresa: empresa, id: id_user},
            rol: {nombre: rol}
        } = JSON.parse(sessionStorage.getItem('user'));

        this.loading = true;
        (await this.usuarioService.getUsuarios()).subscribe({
            next: ({usuarios}: {usuarios: any}) => {
                this.cupo();
                // Si el rol es administrador (rol 3), mostrar todos los usuarios
                if (rol === 'Administrador') {
                    this.usuarios = usuarios.filter(
                        (usuario: any) => usuario.id !== id_user
                    );
                } else {
                    // Filtrar la lista de usuarios según la empresa y excluir al usuario actual
                    this.usuarios = usuarios.filter(
                        (usuario: any) =>
                            usuario.empresa &&
                            usuario.empresa.id === empresa &&
                            usuario.id !== id_user
                    );
                }

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
        } else {
            if (confirm('¿Estás seguro habilitar usuario?')) {
                await this.usuarioService.cambiarEstado(usuario);
                this.obtenerUsuarios();
                this.toastr.info('Usuario habilitado con éxito.');
            }
        }
    }
}
