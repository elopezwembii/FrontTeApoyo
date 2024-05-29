import {Gasto} from '@/interfaces/gastos';
import {Component, OnInit} from '@angular/core';
import {GastosService} from '@services/gastos/gastos.service';

@Component({
    selector: 'app-gasto-hormiga',
    templateUrl: './gasto-hormiga.component.html',
    styleUrls: ['./gasto-hormiga.component.scss']
})
export class GastoHormigaComponent implements OnInit {
    public arrayMonth = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ];
    actualMonth: number = new Date().getMonth();
    gastosHormigas: any = [];
    loading: boolean = false;
    sumaGH: number = 0;
    gastos: Gasto[] = [];
    sumaTotalReal: number = 0;

    constructor(private gastosService: GastosService) {}
    ngOnInit(): void {
        this.obtenerGastos();
    }

    async obtenerGastos() {
        this.loading = true;
        (
            await this.gastosService.getGasto(
                new Date().getMonth() + 1,
                new Date().getFullYear()
            )
        ).subscribe({
            next: ({
                sumaTotalReal,
                gastos
            }: {
                sumaTotalReal: number;
                gastos: Gasto[];
            }) => {
                this.sumaGH = 0;
                this.gastosHormigas = gastos.filter(
                    (gasto) =>
                        gasto.subtipo_gasto === 34 ||
                        gasto.subtipo_gasto === 35 ||
                        gasto.subtipo_gasto === 36 ||
                        gasto.subtipo_gasto === 41 ||
                        gasto.subtipo_gasto === 42 ||
                        gasto.subtipo_gasto === 55 ||
                        gasto.subtipo_gasto === 62 ||
                        gasto.subtipo_gasto === 65 ||
                        gasto.subtipo_gasto === 67 ||
                        gasto.subtipo_gasto === 81 ||
                        gasto.subtipo_gasto === 125 ||
                        gasto.subtipo_gasto === 126 ||
                        gasto.subtipo_gasto === 131 ||
                        gasto.subtipo_gasto === 132 ||
                        gasto.subtipo_gasto === 133
                );
                this.gastosHormigas = this.gastosHormigas.reduce(
                    (acumulador, valorActual) => {
                        const elementoYaExiste = acumulador.find(
                            (elemento) =>
                                elemento.subtipo_gasto ===
                                valorActual.subtipo_gasto
                        );
                        if (elementoYaExiste) {
                            return acumulador.map((elemento) => {
                                if (
                                    elemento.subtipo_gasto ===
                                    valorActual.subtipo_gasto
                                ) {
                                    return {
                                        ...elemento,
                                        monto:
                                            elemento.monto + valorActual.monto
                                    };
                                }

                                return elemento;
                            });
                        }

                        return [...acumulador, valorActual];
                    },
                    []
                );
                this.gastosHormigas.forEach((gh) => {
                    if (
                        gh.subtipo_gasto === 34 ||
                        gh.subtipo_gasto === 35 ||
                        gh.subtipo_gasto === 36
                    ) {
                        gh.img = 'assets/img/hormiga/34.svg';
                    }
                    if (gh.subtipo_gasto === 41 || gh.subtipo_gasto === 42) {
                        gh.img = 'assets/img/hormiga/41.svg';
                    }
                    if (gh.subtipo_gasto === 55) {
                        gh.img = 'assets/img/hormiga/55.svg';
                    }
                    if (gh.subtipo_gasto === 62 || gh.subtipo_gasto === 67) {
                        gh.img = 'assets/img/hormiga/67.svg';
                    }
                    if (gh.subtipo_gasto === 65) {
                        gh.img = 'assets/img/hormiga/65.svg';
                    }
                    if (gh.subtipo_gasto === 81) {
                        gh.img = 'assets/img/hormiga/81.svg';
                    }
                    if (gh.subtipo_gasto === 125) {
                        gh.img = 'assets/img/hormiga/125.svg';
                    }
                    if (gh.subtipo_gasto === 126) {
                        gh.img = 'assets/img/hormiga/126.svg';
                    }
                    if (gh.subtipo_gasto === 131 || gh.subtipo_gasto === 132) {
                        gh.img = 'assets/img/hormiga/131.svg';
                    }
                    if (gh.subtipo_gasto === 133) {
                        gh.img = 'assets/img/hormiga/133.svg';
                    }
                    this.sumaGH += gh.monto;
                });
                this.gastosHormigas = this.gastosHormigas.sort((p1, p2) =>
                    p1.monto < p2.monto ? 1 : p1.monto > p2.monto ? -1 : 0
                );
                this.sumaTotalReal = sumaTotalReal;
                gastos = gastos.reverse();
                if (gastos.length > 3) gastos.length = 3;
                this.gastos = gastos;
                this.loading = false;
            },
            error: (error: any) => {}
        });
    }
}
