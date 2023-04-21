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
                            name: 'monto planificado',
                            type: 'bar',
                            data: [
                                resp.sumaMontoPlanificadoMesAnterior,
                                resp.sumaMontoPlanificado
                            ]
                        },
                        {
                            name: 'monto real',
                            type: 'bar',
                            data: [
                                resp.sumaMontoRealMesAnterior,
                                resp.sumaMontoReal
                            ]
                        }
                    ]
                };
            }
        });
    }
}
