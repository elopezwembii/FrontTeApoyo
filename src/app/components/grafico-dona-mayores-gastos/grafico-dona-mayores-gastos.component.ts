import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-grafico-dona-mayores-gastos',
    templateUrl: './grafico-dona-mayores-gastos.component.html',
    styleUrls: ['./grafico-dona-mayores-gastos.component.scss']
})
export class GraficoDonaMayoresGastosComponent {
    @Input() data: any;

    coloresPastel = [
        '#BCEAF3',
        '#FFD48F',
        '#FFDAC1',
        '#E2F0CB',
        '#2C939E',
        '#C7CEEA',
        '#FFA629',
        '#FFCDFD',
        '#E2F0CB',
        '#FFE2C0'
    ];

    options: any = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal'
        }
    };

    constructor() {}

    ngOnChanges() {
        console.log(this.data);
        this.options = {
            ...this.options,
            color: this.coloresPastel,
            series: [
                {
                    name: 'Item',
                    type: 'pie',
                    radius: ['30%', '70%'],
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
                        formatter: '{d}%',
                        position: 'inside',
                        fontSize: 12,
                        color: '#FFF',
                        fontWeight: 'bold'
                    },
                    center: ['50%', '50%']
                }
            ]
        };
    }
}
