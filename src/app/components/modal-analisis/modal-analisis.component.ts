import {Component} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'app-modal-analisis',
    templateUrl: './modal-analisis.component.html',
    styleUrls: ['./modal-analisis.component.scss']
})
export class ModalAnalisisComponent {
    myModal: any;
    tipo: number;
    subtipo: number;
    indicador: number;


    constructor(private toastr: ToastrService) {}

    ngOnInit() {
        this.myModal = new bootstrap.Modal(
            document.getElementById('modalAhorro'),
            {}
        );
    }

    openModal(tipo: number, subtipo: number, indicador: number) {
        this.indicador = indicador;
        this.tipo = tipo;
        this.subtipo = subtipo;
        this.myModal.show();
    }
}
