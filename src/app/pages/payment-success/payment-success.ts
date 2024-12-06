import {Component, OnInit, Renderer2, ElementRef} from '@angular/core';
import { PlanesService } from '@services/planes/planes.service';

@Component({
    selector: 'app-ingresos',
    templateUrl: './payment-success.html',
    styleUrls: ['./payment-success.scss']
})
export class PaymentSuccessComponent implements OnInit{
    loading: boolean = false;
    plan: any;
    
    constructor(
        private planService: PlanesService
    ) {}
    ngOnInit(): void {
        this.obtenerPlan();
    }
    
    obtenerPlan(){
        this.planService.miPlan().subscribe({
            next: (resp: any) => {
                this.plan = resp;
            }
        })
    }
}
