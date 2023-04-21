import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {IngresosService} from '@services/ingresos/ingresos.service';
import {EChartsOption} from 'echarts';

@Component({
    selector: 'app-grafico',
    templateUrl: './grafico.component.html',
    styleUrls: ['./grafico.component.scss']
})
export class GraficoComponent implements OnChanges {
    @Input() fecha: string;
    @Input() change: boolean;

    public porcentaje: number;
    public infinto: number = Infinity;

    options: any = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        }
    };

    constructor(private ingresoService: IngresosService) {}


    ngOnChanges() {
        this.ingresoService.sumarMontosPorFecha(this.fecha).subscribe({
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
                this.porcentaje = Math.abs(
                    (resp.sumaMontoReal * 100) /
                        resp.sumaMontoRealMesAnterior /
                        100
                );
            }
        });
    }
}
