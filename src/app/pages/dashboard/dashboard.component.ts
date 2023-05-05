import {Component, OnInit} from '@angular/core';
import {PresupuestoService} from '@services/presupuesto/presupuesto.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    usuario: string = 'Carla Soto';
    graficoDonaPresupuesto: any;

    gastoReal=[
        {
            "name": "Créditos",
            "value": 800000
        },
        {
            "name": "Servicios básicos",
            "value": 400000
        },
        {
            "name": "Alimento y comida",
            "value": 500000
        },
        {
            "name": "Entretenimiento",
            "value": 870000
        },
        {
            "name": "Salud y belleza",
            "value": 750000
        },
        {
            "name": "Ahorro e inversiones",
            "value": 850000
        }
    ]

    constructor(
        private presupuestoService: PresupuestoService,
        private toastr: ToastrService
    ) {}
    ngOnInit(): void {
        this.obtenerDatoGrafico();
    }

    obtenerDatoGrafico() {
        this.presupuestoService.obtenerDatosGrafico(4, 2023).subscribe({
            next: (resp: any) => {
                this.graficoDonaPresupuesto = resp;
                console.log({resp});
                
            }
        });
    }
}
