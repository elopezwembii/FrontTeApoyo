import {Component, OnInit} from '@angular/core';
import {AhorroService} from '@services/ahorro/ahorro.service';

@Component({
    selector: 'app-grafico-linea',
    templateUrl: './grafico-linea.component.html',
    styleUrls: ['./grafico-linea.component.scss']
})
export class GraficoLineaComponent implements OnInit {
    options = {
        title: {
            text: '¡Wow!',
            left: 'center',
            top: 10
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [],

        legend: {
            orient: 'horizontal',
            bottom: 0,
            data: ['2018', '2019']
        }
    };

    constructor(private ahorroServicio: AhorroService) {}
    ngOnInit() {
        this.ahorroServicio.obtenerAhorroHistorial().subscribe({
            next: (data: any) => {
                this.options = {
                    ...this.options,
                    xAxis: {
                        type: 'category',
                        data: data.map(d => d.year)
                      },
                      
                      series: [{
                        data: data.map(d => d.amount),
                        type: 'line',
                        itemStyle: {
                            color: '#BCEAF3'
                        }
                      }]

                };
            }
        });
    }
}
