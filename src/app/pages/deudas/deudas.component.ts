import {Component} from '@angular/core';

@Component({
    selector: 'app-deudas',
    templateUrl: './deudas.component.html',
    styleUrls: ['./deudas.component.scss']
})
export class DeudasComponent {
    deudas = [
        {
            nombre: 'Crédito automotriz',
            monto_total: 5000000,
            cuotas_totales: 48,
            cuotas_pagadas: 40,
            pago_mensual: 120000,
            dia_pago: 5,
            id_banco: 3
        },
        {
            nombre: 'Crédito consumo',
            monto_total: 100000,
            cuotas_totales: 12,
            cuotas_pagadas: 2,
            pago_mensual: 12000,
            dia_pago: 5,
            id_banco: 4
        }
    ];

    modal: HTMLElement;

    abrirModal() {
        this.modal = document.getElementById('exampleModal');
        this.modal.classList.add('show');
        this.modal.style.display = 'block';
    }

    cerrarModal() {
        this.modal.classList.remove('show');
        this.modal.style.display = 'none';
    }
}
