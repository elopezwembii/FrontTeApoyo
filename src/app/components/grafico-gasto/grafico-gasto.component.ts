import {Component, Input, OnChanges} from '@angular/core';
import {GastosService} from '@services/gastos/gastos.service';
import {IngresosService} from '@services/ingresos/ingresos.service';

@Component({
    selector: 'app-grafico-gasto',
    templateUrl: './grafico-gasto.component.html',
    styleUrls: ['./grafico-gasto.component.scss']
})
export class GraficoGastoComponent implements OnChanges {
    @Input() change: boolean;
    @Input() mes: number;
    @Input() anio: number;
    public loading: boolean = false;
    @Input() totalGastos: number;
    public porcentaje: number = 0;

    options: any = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '0%',
            left: 'center'
        }
    };
    constructor(private ingresoService: IngresosService) {}

    async ngOnChanges() {
        this.loading = true;
        (
            await this.ingresoService.sumaMontoActual(this.mes, this.anio)
        ).subscribe((actual) => {
            this.options = {
                ...this.options,
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {
                                value:
                                    actual.totalVariableActual +
                                    actual.totalVariableFijo,
                                name: 'Ingresos',
                                itemStyle: {
                                    color: '#bceaf3'
                                }
                            },
                            {
                                value: this.totalGastos,
                                name: 'Gastos',
                                itemStyle: {
                                    color: '#ffd48f'
                                }
                            }
                        ]
                    }
                ]
            };
            let suma =
                actual.totalVariableActual +
                actual.totalVariableFijo +
                this.totalGastos;
            this.porcentaje = (this.totalGastos * 100) / suma;
            this.loading = false;
        });
    }
}
