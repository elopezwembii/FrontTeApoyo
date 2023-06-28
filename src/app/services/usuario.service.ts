import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    usuarios: any = [];
    constructor(private _http: HttpClient) {}

    async getUsuarios() {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(environment.uri_api + 'usuarios', {
                        headers: {
                            Authorization:
                                'Bearer ' +
                                JSON.parse(sessionStorage.getItem('user'))
                                    .access_token
                        }
                    })
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            this.usuarios = data;
            return of({usuarios: this.usuarios});
        } catch (error) {}
    }

    async agregarUsuario(usuario: any): Promise<boolean> {
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'usuarios',
                        {
                            email: usuario.email,
                            password: usuario.password,
                            rol: usuario.rol
                        },
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async actualizarUsuario(usuario: any): Promise<boolean> {
        const idUsuario = usuario.id;
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'perfil/' + idUsuario,
                        {
                            rut: usuario.rut,
                            fecha_nacimiento: usuario.fecha_nacimiento,
                            nombres: usuario.nombres,
                            apellidos: usuario.apellidos,
                            genero: usuario.genero,
                            nacionalidad: usuario.nacionalidad,
                            ciudad: usuario.ciudad,
                            direccion: usuario.direccion,
                            telefono: usuario.telefono,
                            email: usuario.email
                        },
                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async cambiarEstado(usuario: any): Promise<boolean> {
        const idUsuario = usuario.id;
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .get(
                        environment.uri_api +
                            'usuarios/cambiar-perfil/' +
                            idUsuario,

                        {
                            headers: {
                                Authorization:
                                    'Bearer ' +
                                    JSON.parse(sessionStorage.getItem('user'))
                                        .access_token
                            }
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}
