import {Ahorro} from '@/interfaces/ahorro';
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
    @ViewChild('modalAhorro') modalAhorro: ModalAhorroComponent;

    constructor(
        private ahorroService: AhorroService,
        private toastr: ToastrService
    ) {}
    ngOnInit() {
        this.obtenerAhorros();
    }

    obtenerAhorros() {
        this.ahorroService.obtenerAhorros().subscribe({
            next: (ahorro: Ahorro[]) => {
                this.ahorros = ahorro;
            }
        });
    }

    editarAhorro(ahorro: Ahorro) {
        this.ahorroService.editarAhorro(ahorro).subscribe({
            next: (value: boolean) => {
                console.log(value);
            }
        });
    }
    eliminarAhorro(ahorro: Ahorro) {
        this.ahorroService.eliminarAhorro(ahorro).subscribe({
            next: (value: boolean) => {
                this.toastr.success(`Eliminado correctamente`);
            },
            error: (value: any) => {
                this.toastr.error('Error', value);
            }
        });
    }

    openModal() {
        this.modalAhorro.openModal();
    }
}
