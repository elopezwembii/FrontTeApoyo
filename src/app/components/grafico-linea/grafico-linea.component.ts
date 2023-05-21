import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {AhorroService} from '@services/ahorro/ahorro.service';

@Component({
    selector: 'app-grafico-linea',
    templateUrl: './grafico-linea.component.html',
    styleUrls: ['./grafico-linea.component.scss']
})
export class GraficoLineaComponent implements OnChanges {
    @Input() historial: any;
    @Input() change: boolean;
    options = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                inside: true
            }
        },
        series: [],

        legend: {
            orient: 'horizontal',
            bottom: 0
        },
        tooltip: {
            trigger: 'axis'
        }
    };

    constructor() {}

    ngOnChanges() {
        this.change = !this.change;
        this.options = {
            ...this.options,
            xAxis: {
                type: 'category',
                data: this.historial.map((d) => d.year)
            },

            series: [
                {
                    data: this.historial.map((d) => d.amount),
                    type: 'line',
                    itemStyle: {
                        color: '#BCEAF3'
                    }
                }
            ]
        };
    }
}
