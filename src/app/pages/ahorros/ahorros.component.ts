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
    historial: any = [];
    loading: boolean = false;
    change: boolean = false;
    @ViewChild('modalAhorro') modalAhorro: ModalAhorroComponent;

    public tiposAhorro: TipoAhorro[] = [
        {
            id: 1,
            descripcion: 'Ahorro celebraciones',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 2,
            descripcion: 'Ahorro cumpleaños',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 3,
            descripcion: 'Ahorro Educación',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 4,
            descripcion: 'Ahorro fiestas patrias',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 5,
            descripcion: 'Ahorro fin de semana largo',
            img: 'assets/img/ahorro/ahorro3.svg'
        },
        {
            id: 6,
            descripcion: 'Ahorro navidad/año nuevo',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 7,
            descripcion: 'Ahorro viajes/vacaciones',
            img: 'assets/img/ahorro/ahorro3.svg'
        },
        {
            id: 8,
            descripcion: 'Fondo de emergencia',
            img: 'assets/img/ahorro/ahorro4.svg'
        },
        {
            id: 9,
            descripcion: 'Ahorro general (varios)',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 10,
            descripcion: 'Inversiones y Acciones',
            img: 'assets/img/ahorro/ahorro1.svg'
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
      this.change = !this.change
        this.loading = true;
        (await this.ahorroService.obtenerAhorros()).subscribe({
            next: ({ahorros, historial}: {ahorros: any, historial:any}) => {
                this.ahorros = ahorros;
                this.historial = historial
                this.loading = false;
            },
            error: (error: any) => {}
        });
    }

    async eliminarAhorro(ahorro: Ahorro) {
        if (confirm('¿Estás seguro de eliminar el ahorro?')) {
            const res = this.ahorroService.eliminarAhorro(ahorro);
            if (res) {
                this.obtenerAhorros();
                this.toastr.success('Ahorro eliminado');
            } else {
                this.toastr.error('Error');
                this.loading = false;
            }
        }
    }

    openModal(ahorro: Ahorro = null) {
        this.modalAhorro.openModal(ahorro, this.ahorros);
    }

    actualizarAhorro(ahorroMod: Ahorro[]) {
        this.ahorros = ahorroMod;
    }

    actualizarCarga(loading: boolean) {
        this.loading = loading;
    }

    calculoMontoMensual(fecha, meta, recaudado) {
      let dia1 = new Date();
      let dia2 = new Date(fecha);
      let diferenciaMilisegundos: number = dia2.getTime() - dia1.getTime();
      let mesesDiferencia: number = diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 30.4375);
      const mesesDiferenciaRedondeado: number = Math.round(mesesDiferencia);
      if (mesesDiferenciaRedondeado === 0) {
        return meta - recaudado
      }else{
        return ((meta - recaudado) / mesesDiferenciaRedondeado);
      }

    }
}
