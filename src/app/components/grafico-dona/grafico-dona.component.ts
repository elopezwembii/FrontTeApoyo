import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-grafico-dona',
    templateUrl: './grafico-dona.component.html',
    styleUrls: ['./grafico-dona.component.scss']
})
export class GraficoDonaComponent {
    @Input() data: any;

    options: any = {
        backgroundColor: '#fff',
        title: {
            text: 'Distribución de presupuesto',
            left: 'center',
            top: 10
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: 20
        }
    };

    constructor() {}

    ngOnChanges() {
        this.options = {
            ...this.options,
            series: [
                {
                    name: 'Distribución del presupuesto',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    data: this.data,
                    itemStyle: {
                        borderWidth: 0
                    },
                    emphasis: {
                        itemStyle: {
                            borderWidth: 0
                        }
                    },
                    label: {
                        show: true,
                        formatter: '{d}%',
                        position: 'inside'
                    }
                }
            ]
        };
    }
}
