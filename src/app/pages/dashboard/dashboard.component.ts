import {Ahorro} from './../../interfaces/ahorro';
import {Component, OnInit} from '@angular/core';
import {AhorroService} from '@services/ahorro/ahorro.service';
import {AppService} from '@services/app.service';
import {GastosService} from '@services/gastos/gastos.service';
import {PresupuestoService} from '@services/presupuesto/presupuesto.service';
import {ToastrService} from 'ngx-toastr';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    usuario: any;
    presupuesto: any = [{value:100, name:"prueba"}];
    gastoReal: any = [{value:100, name:"prueba"}];
    gastosHormigas: any = [];
    ahorros: Ahorro[] = [];
    posibleAhorro: number;
    nivel: string;
    siguienteNivel: string;
    ahorroSiguienteNivel: number;

    constructor(
        private presupuestoService: PresupuestoService,
        private ahorroService: AhorroService,
        private gastosService: GastosService,
        private appService: AppService
    ) {}
    ngOnInit(): void {
        /* this.obtenerDatoGrafico(); */
        this.obtenerAhorros();
        this.obtenerGastoHormiga();
        this.obtenerUsuario();
    }

    async obtenerAhorros() {

      (await this.ahorroService.obtenerAhorros()).subscribe({
          next: ({ahorros}: {ahorros: any}) => {
              this.ahorros = ahorros;
          },
          error: (error: any) => {}
      });
  }

    obtenerGastoHormiga() {
        this.gastosService.obtenerGastoHormiga().subscribe({
            next: (gastoHormiga: any) => {
                this.gastosHormigas = gastoHormiga;
            }
        });
    }

    obtenerDatoGrafico() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const presupuesto$ = this.presupuestoService.getPresupuesto(
            month,
            year
        );
        const gastoReal$ = this.gastosService.getGasto(
            month,
            year
        );

        forkJoin([presupuesto$,gastoReal$]).subscribe({
            next: ([presupuesto,gastoReal]) => {
                this.presupuesto = presupuesto;
                this.gastoReal = gastoReal
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    obtenerUsuario() {
        this.usuario = JSON.parse(this.appService.user).user;
        console.log(this.usuario);
        this.ahorroService.obtenerNivelAhorroUsuario().subscribe({
            next: ({
                posibleAhorro,
                nivel,
                siguienteNivel,
                ahorroSiguienteNivel
            }: any) => {
                this.posibleAhorro = posibleAhorro;
                this.nivel = nivel;
                this.siguienteNivel = siguienteNivel;
                this.ahorroSiguienteNivel = ahorroSiguienteNivel;
            }
        });
    }
}
