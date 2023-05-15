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
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
        }
    };

    constructor() {}

    ngOnChanges() {
      console.log(this.data);
        this.options = {
            ...this.options,
            series: [
                {
                    name: 'Distribución del presupuesto',
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
                      fontSize: 15,
                      color: '#fff',
                      fontWeight: 'bold'
                  },
                  center: ['50%', '50%'],
                }
            ]
        };
    }
}
