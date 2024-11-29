import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {ItemPresupuesto} from '@/interfaces/presupuesto';
import {Gasto} from '@/interfaces/gastos';

@Component({
    selector: 'app-grafico-barra',
    templateUrl: './grafico-barra.component.html',
    styleUrls: ['./grafico-barra.component.scss']
})
export class GraficoBarraComponent implements OnChanges {
    @Input() gastoReal: any = [];
    @Input() presupuesto: any = [];

    options: any = {
        seriesDefaults: {
            bar: {
                barBorderRadius: [10, 10, 0, 0]
            }
        },
        xAxis: {
            axisLabel: {
                rotate: 0
            }
        },
        yAxis: {
            axisLabel: {
                formatter: function (value) {
                    if (value >= 1000000) {
                        return (value / 1000000) + 'M';
                    } else if (value >= 1000) {
                        return (value / 1000) + 'K';
                    } else {
                        return value;
                    }
                }
            }
        },
        series: [],
        legend: {
            data: ['Presupuesto', 'Gasto real'],
            orient: 'vertical',
            right: 10,
            top: 10,
            title: {
                text: 'Título de la Leyenda'
            }
        }
    };

    constructor(private currencyPipe: CurrencyPipe) {}

    ngOnChanges() {
        if (this.presupuesto !== undefined && this.gastoReal !== undefined) {
            const concatenado = this.presupuesto.concat(this.gastoReal);
            const SinRepetidos = concatenado.filter(
                (titulo, indice, arreglo) => {
                    const primerIndice = arreglo.findIndex(
                        (p) => p.name === titulo.name
                    );
                    if (primerIndice === indice) {
                        return true;
                    }
                    return false;
                }
            );
            let arregloPresupuesto = [],
                arregloGasto = [];
            if (SinRepetidos.length > 0) {
                SinRepetidos.map((item) => {
                    let auxGasto = false;
                    let auxPre = false;
                    for (const gasto of this.gastoReal) {
                        if (gasto.name === item.name) {
                            arregloGasto.push(gasto.value);
                            auxGasto = true;
                            break;
                        } else {
                            auxGasto = false;
                        }
                    }
                    for (const pre of this.presupuesto) {
                        if (pre.name === item.name) {
                            arregloPresupuesto.push(pre.value);
                            auxPre = true;
                            break;
                        } else {
                            auxPre = false;
                        }
                    }
                    if (!auxGasto) {
                        arregloGasto.push(0);
                    }
                    if (!auxPre) {
                        arregloPresupuesto.push(0);
                    }
                });
            }
            
            this.options = {
                ...this.options,
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return `${params.name}: ${ '$ ' +
                        params.value
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
                    },
                    position: function (point, params, dom, rect, size) {
                        // Coordenadas x e y del ratón
                        let x = point[0];
                        let y = point[1];
                        // Tamaño de la caja del tooltip
                        let boxWidth = size.contentSize[0];
                        let boxHeight = size.contentSize[1];
                        // Tamaño de la caja del gráfico
                        let graphWidth = size.viewSize[0];
                        let graphHeight = size.viewSize[1];
                        // Evita que el tooltip se salga por la derecha
                        if (x + boxWidth > graphWidth) {
                            x = graphWidth - boxWidth;
                        }
                        // Evita que el tooltip se salga por la izquierda
                        if (x < 0) {
                            x = 0;
                        }
                        // Evita que el tooltip se salga por arriba
                        if (y + boxHeight > graphHeight) {
                            y = graphHeight - boxHeight;
                        }
                        // Evita que el tooltip se salga por abajo
                        if (y < 0) {
                            y = 0;
                        }
                        return [x, y];
                    }
                },
                xAxis: {
                    data: SinRepetidos.map((item) => item.name),
                    axisLabel: {
                        rotate: 20,
                        show: false
                    }
                },
                color: ['#BCEAF3', '#FFD48F'],
                series: [
                    {

                        label: {
                            show: false,
                            position: 'top',
                            rotate: 90,
                            align: 'center',
                            verticalAlign: 'middle',
                            formatter: (params: any) => {
                                return (
                                    '$ ' +
                                    params.value
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                );
                            },
                            textStyle: {
                                color: 'black',
                                fontSize: 12,
                            }
                        },
                        itemStyle: {
                            color: '#00ffff',
                            borderRadius: [5, 5, 0, 0]
                        },
                        name: 'Presupuesto',
                        type: 'bar',
                        data: arregloPresupuesto,
                        z: 2
                    },
                    {
                        name: 'Gasto real',
                        type: 'bar',
                        data: arregloGasto,
                        z: 1,
                        itemStyle: {
                            color: '#93278F',
                            borderRadius: [5, 5, 0, 0]
                        },
                        label: {
                            show: false,
                            position: 'top',
                            rotate: 90,
                            align: 'center',
                            verticalAlign: 'middle',
                            formatter: (params: any) => {
                                return (
                                    '$ ' +
                                    params.value
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                );
                            },
                            textStyle: {
                                color: 'black',
                                fontSize: 12
                            }
                        }
                    }
                ]
            };
        }
    }
}
