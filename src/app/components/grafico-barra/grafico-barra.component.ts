import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
    selector: 'app-grafico-barra',
    templateUrl: './grafico-barra.component.html',
    styleUrls: ['./grafico-barra.component.scss']
})
export class GraficoBarraComponent implements OnChanges {
    @Input() gastoReal: any = [];
    @Input() presupuesto: any = [];

    options:any = {
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
        console.log('presupuesto', this.presupuesto);
        console.log('gasto real', this.gastoReal);
   
        this.options = {
            ...this.options,
            xAxis: {
                data: this.presupuesto.map((item: any) => item.name),
                axisLabel: {
                    rotate: 30
                  }
            },
            series: [
                {
                    label: {
                        show: true,
                        position: 'top',
                        formatter: (params) => {
                            return this.currencyPipe.transform(
                                params.value,
                                'USD',
                                'symbol-narrow',
                                '1.0-0'
                            );
                        },
                        textStyle: {
                            color: 'black',
                            fontSize: 12
                        }
                    },
                    name: 'Presupuesto',
                    type: 'bar',
                    data: this.presupuesto,
                    barGap: '-50%',
                    z: 2
                },
                {
                    name: 'Gasto real',
                    type: 'bar',
                    data: this.gastoReal,
                    barGap: '-50%',
                    z: 1
                }
            ]
        };
    }
}
