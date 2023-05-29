import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {IngresosService} from '@services/ingresos/ingresos.service';
import {EChartsOption} from 'echarts';
import echarts from 'echarts/types/dist/echarts';

@Component({
    selector: 'app-grafico',
    templateUrl: './grafico.component.html',
    styleUrls: ['./grafico.component.scss']
})
export class GraficoComponent implements OnChanges {
    @Input() change: boolean;
    @Input() mes: number;
    @Input() anio: number;

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

    public porcentaje: any;
    public infinto: number = Infinity;
    public nan: number = NaN;
    public loading: boolean = false;

    options: any = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: true
                }
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
            boundaryGap: [0, 0.01],
            axisLabel: {
                rotate: 45,
                formatter: (params: any) => {
                    return (
                        '$' +
                        params.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    );
                }
            }
        }
    };

    constructor(private ingresoService: IngresosService) {}

    async ngOnChanges() {
        this.loading = true;
        (
            await this.ingresoService.sumaMontoActual(this.mes, this.anio)
        ).subscribe(async (actual) => {
            (
                await this.ingresoService.sumaMontoActual(
                    this.mes - 1,
                    this.anio
                )
            ).subscribe((anterior) => {
                this.options = {
                    ...this.options,
                    yAxis: {
                        type: 'category',
                        data: [
                            this.arrayMonth[this.mes - 2],
                            this.arrayMonth[this.mes - 1]
                        ]
                    },
                    series: [
                        {
                            name: 'Ingreso fijo',
                            type: 'bar',
                            data: [
                                anterior.totalVariableFijo,
                                actual.totalVariableFijo
                            ],
                            barGap: '30%',
                            barCategoryGap: '30%',
                            itemStyle: {
                                color: '#bceaf3',
                                borderRadius: [0, 5, 5, 0]
                            },
                            label: {
                                show: true,
                                position: 'insideRight',
                                offset: [20, 0],
                                valueAnimation: true,
                                formatter: (params: any) => {
                                    return (
                                        '$' +
                                        params.value
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.'
                                            )
                                    );
                                }
                            }
                        },
                        {
                            name: 'Ingreso variable',
                            type: 'bar',
                            data: [
                                anterior.totalVariableActual,
                                actual.totalVariableActual
                            ],
                            itemStyle: {
                                color: '#ffd48f',
                                borderRadius: [0, 5, 5, 0]
                            },
                            label: {
                                show: true,
                                position: 'insideRight',
                                offset: [20, 0],
                                valueAnimation: true,
                                formatter: (params: any) => {
                                    return (
                                        '$' +
                                        params.value
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                '.'
                                            )
                                    );
                                }
                            }
                        }
                    ]
                };
                let sumaActual =
                    actual.totalVariableActual + actual.totalVariableFijo;
                let sumaAnterior =
                    anterior.totalVariableActual + anterior.totalVariableFijo;
                if (sumaActual - sumaAnterior > 0) {
                    //aumenta
                    this.porcentaje =
                        ((sumaActual - sumaAnterior) / sumaAnterior) * 100;
                } else {
                    //disminuye
                    this.porcentaje =
                        ((sumaAnterior - sumaActual) / sumaAnterior) * 100 * -1;
                }
                this.loading = false;
                console.log(this.porcentaje);
            });
        });
    }
}
