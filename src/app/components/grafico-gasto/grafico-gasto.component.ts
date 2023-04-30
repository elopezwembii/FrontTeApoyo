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
    public infinity: number = Infinity;
    public nan: number = NaN;

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
            let sumaIngreso =
                actual.totalVariableActual + actual.totalVariableFijo;
            this.porcentaje = (this.totalGastos * 100) / sumaIngreso;
            if (sumaIngreso < this.totalGastos) {
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
                                    value: 0,
                                    name: 'Ingresos',
                                    itemStyle: {
                                        color: '#bceaf3'
                                    }
                                },
                                {
                                    value: 100,
                                    name: 'Gastos',
                                    itemStyle: {
                                        color: '#ffd48f'
                                    }
                                }
                            ]
                        }
                    ]
                };
            } else {
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
                                    value: (100 - this.porcentaje).toFixed(2),
                                    name: 'Ingresos',
                                    itemStyle: {
                                        color: '#bceaf3'
                                    }
                                },
                                {
                                    value: this.porcentaje.toFixed(2),
                                    name: 'Gastos',
                                    itemStyle: {
                                        color: '#ffd48f'
                                    }
                                }
                            ]
                        }
                    ]
                };
            }

            this.loading = false;
            console.log(this.porcentaje);
        });
    }
}
