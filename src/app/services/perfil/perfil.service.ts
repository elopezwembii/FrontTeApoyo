import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    familia = [
        {
            nombre: 'Juan',
            apellidoPaterno: 'Pérez',
            apellidoMaterno: 'rojas',
            rut: '11.111.111-1',
            correo: 'juan@example.com'
        },
        {
            nombre: 'María',
            apellidoPaterno: 'González',
            apellidoMaterno: 'diaz',
            rut: '22.222.222-2',
            correo: 'maria@example.com'
        }
    ];

    constructor() {}

    obtenerInformacionUsuario() {
        return of({
            rut: '11.111.111-1',
            nombre: 'Juan',
            apellidoPaterno: 'Diaz',
            apellidoMaterno: 'Perez',
            correo: 'test@gmail.com',
            celular: '+569 12345678',
            direccion: 'Av. Angamos #2343',
            ciudad: 'antofagasta',
            nacionalidad: 'Chilena',
            fechaNacimiento: '11/02/1980',
            genero: 'Masculino'
        });
    }

    actualizarPerfil() {
        return new Observable<boolean>((observer) => {
            setTimeout(() => {
                observer.next(true);
                observer.complete();
            }, 2000);
        });
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
