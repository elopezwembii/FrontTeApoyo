import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    familia = [];

    constructor(private _http: HttpClient) {}

    async obtenerInformacionUsuario() {
        const idUsuario = JSON.parse(sessionStorage.getItem('user')).user.id;
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(environment.uri_api + 'perfil/' + idUsuario, {
                        headers: {
                            Authorization:
                                'Bearer ' +
                                JSON.parse(sessionStorage.getItem('user'))
                                    .access_token
                        }
                    })
                    .subscribe(
                        (response) => resolve(response),
                        (error) => reject(error)
                    );
            });
            console.log(data);
            return of({
                perfil: data
            });
        } catch (error) {}
    }

    async actualizarPerfil(perfil: any) {
        const idUsuario = JSON.parse(sessionStorage.getItem('user')).user.id;
        try {
            const res = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        environment.uri_api + 'perfil/' + idUsuario,
                        {
                            rut: perfil.rut,
                            fecha_nacimiento: perfil.fecha_nacimiento,
                            nombres: perfil.nombres,
                            apellidos: perfil.apellidos,
                            genero: perfil.genero,
                            nacionalidad: perfil.nacionalidad,
                            ciudad: perfil.ciudad,
                            direccion: perfil.direccion,
                            telefono: perfil.telefono,
                            email: perfil.email
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
            console.log(res);
        } catch (error) {}
    }

    obtenerFamilia() {
        return of(this.familia);
    }

    agregarFamiliar(familiar: any) {
        return new Observable((observer) => {
            this.familia.push(familiar);
            observer.next();
            observer.complete();
        });
    }
}
