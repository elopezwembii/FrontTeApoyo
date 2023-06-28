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
        yAxis: {},
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

            console.log(arregloPresupuesto);
            console.log(arregloGasto);

            this.options = {
                ...this.options,

                xAxis: {
                    data: SinRepetidos.map((item) => item.name),
                    axisLabel: {
                        rotate: 20
                    }
                },
                color: ['#BCEAF3', '#FFD48F'],
                series: [
                    {

                        label: {
                            show: true,
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
                            color: '#bceaf3',
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
                            color: '#ffd48f',
                            borderRadius: [5, 5, 0, 0]
                        },
                        label: {
                            show: true,
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
