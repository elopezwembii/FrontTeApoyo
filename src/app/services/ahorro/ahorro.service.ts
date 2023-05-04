import {Ahorro} from '@/interfaces/ahorro';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AhorroService {
    ahorroHistorial = [
        {
            year: 2018,
            amount: 1200
        },
        {
            year: 2019,
            amount: 1500
        },
        {
            year: 2020,
            amount: 1800
        },
        {
            year: 2021,
            amount: 2000
        }
    ];

    private ahorros: Ahorro[] = [
        {
            id: 'AH1',
            nombre: 'Ahorro casa nueva',
            monto: 195000,
            fechaLimite: new Date(2023, 11, 31, 10, 30, 0, 0),
            recaudado: 1750000,
            meta: 3500000,
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 'AH2',
            nombre: 'Ahorro viaje al caribe',
            monto: 80000,
            fechaLimite: new Date(2024, 1, 1, 10, 30, 0, 0),
            recaudado: 880000,
            meta: 3500000,
            img: 'assets/icons/ahorro2.png'
        }
    ];

    constructor() {}

    obtenerAhorros(): Observable<Ahorro[]> {
        this.ahorros.forEach((ahorro: Ahorro) => {
            ahorro.progreso = Math.round(
                (ahorro.recaudado / ahorro.meta) * 100
            );
        });
        return of(this.ahorros);;
    }

    eliminarAhorro(ahorro: Ahorro): Observable<boolean> {
        const index = this.ahorros.findIndex((a) => a === ahorro);
        if (index !== -1) {
            this.ahorros.splice(index, 1);
            return of(true);
        }
        return of(false);
    }

    editarAhorro(ahorro: Ahorro): Observable<boolean> {
        const index = this.ahorros.findIndex((a) => a.id === ahorro.id);
        if (index === -1) {
            return of(false);
        }
        this.ahorros[index] = {...this.ahorros[index], ...ahorro};
        return of(true);
    }

    agregarAhorro(ahorro: Ahorro): Observable<Ahorro[]> {
        const id = 'AH' + (this.ahorros.length + 1);
        const img = 'assets/icons/ahorro1.png';
        const nuevoAhorro = {...ahorro, id, img};
        this.ahorros.push(nuevoAhorro);
        return of(this.ahorros);
    }

    obtenerAhorroHistorial() {
      return of(this.ahorroHistorial);
    }
}
