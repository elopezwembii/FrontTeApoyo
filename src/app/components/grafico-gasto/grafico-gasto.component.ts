import {Component, Input, OnChanges} from '@angular/core';
import {GastosService} from '@services/gastos/gastos.service';

@Component({
    selector: 'app-grafico-gasto',
    templateUrl: './grafico-gasto.component.html',
    styleUrls: ['./grafico-gasto.component.scss']
})
export class GraficoGastoComponent implements OnChanges {
    @Input() fecha: string;
    @Input() change: boolean;

    options: any = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '0%',
            left: 'center'
        },
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
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 1048, name: 'Ingresos', itemStyle: {
                      color: '#bceaf3'
                  }},
                    {value: 735, name: 'Gastos', itemStyle: {
                      color: '#ffd48f'
                  }},
                ]
            }
        ]
    };
    constructor(private gastoService: GastosService) {}

    ngOnChanges() {
        /* this.gastoService.sumarMontosPorFecha(this.fecha).subscribe({
            next: (resp: any) => {
                this.options = {
                    ...this.options,
                    yAxis: {
                        type: 'category',
                        data: [resp.nombreMesAnterior, resp.nombreMesActual]
                    },
                    series: [
                        {
                            name: 'Monto Planificado',
                            type: 'bar',
                            data: [
                                resp.sumaMontoPlanificadoMesAnterior,
                                resp.sumaMontoPlanificado
                            ],
                            itemStyle: {
                                color: '#bceaf3'
                            }
                        },
                        {
                            name: 'Monto Real',
                            type: 'bar',
                            data: [
                                resp.sumaMontoRealMesAnterior,
                                resp.sumaMontoReal
                            ],
                            itemStyle: {
                                color: '#ffd48f'
                            }
                        }
                    ]
                };
            }
        }); */
    }
}
