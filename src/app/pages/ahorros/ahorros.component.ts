import {Ahorro, TipoAhorro} from '@/interfaces/ahorro';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalAhorroComponent} from '@components/modal-ahorro/modal-ahorro.component';
import {AhorroService} from '@services/ahorro/ahorro.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-ahorros',
    templateUrl: './ahorros.component.html',
    styleUrls: ['./ahorros.component.scss']
})
export class AhorrosComponent implements OnInit {
    ahorros: Ahorro[] = [];
    loading: boolean = false;
    @ViewChild('modalAhorro') modalAhorro: ModalAhorroComponent;

    public tiposAhorro: TipoAhorro[] = [
        {
            id: 1,
            descripcion: 'Ahorro celebraciones',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 2,
            descripcion: 'Ahorro cumpleaños',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 3,
            descripcion: 'Ahorro Educación',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 4,
            descripcion: 'Ahorro fiestas patrias',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 5,
            descripcion: 'Ahorro fin de semana largo',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 6,
            descripcion: 'Ahorro navidad/año nuevo',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 7,
            descripcion: 'Ahorro viajes/vacaciones',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 8,
            descripcion: 'Fondo de emergencia',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 9,
            descripcion: 'Ahorro general (varios)',
            img: 'assets/icons/ahorro1.png'
        },
        {
            id: 10,
            descripcion: 'Inversiones y Acciones',
            img: 'assets/icons/ahorro1.png'
        }
    ];

    constructor(
        private ahorroService: AhorroService,
        private toastr: ToastrService
    ) {}
    ngOnInit() {
        this.obtenerAhorros();
    }

    async obtenerAhorros() {
        this.loading = true;
        (await this.ahorroService.obtenerAhorros()).subscribe({
            next: ({ahorros}: {ahorros: any}) => {
                this.ahorros = ahorros;
                this.loading = false;
            },
            error: (error: any) => {}
        });
    }

    eliminarAhorro(ahorro: Ahorro) {
        this.ahorroService.eliminarAhorro(ahorro).subscribe({
            complete: () => {
                this.toastr.success(`Eliminado correctamente`);
            },
            error: (value: any) => {
                this.toastr.error('Error', value);
            }
        });
    }

    openModal(ahorro: Ahorro = null) {
        this.modalAhorro.openModal(ahorro, this.ahorros);
    }

    actualizarAhorro(ahorroMod: Ahorro[]) {
        this.ahorros = ahorroMod;
    }
}
