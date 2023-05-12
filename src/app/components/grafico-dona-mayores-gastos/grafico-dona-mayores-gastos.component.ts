import {Component} from '@angular/core';

@Component({
    selector: 'app-grafico-dona-mayores-gastos',
    templateUrl: './grafico-dona-mayores-gastos.component.html',
    styleUrls: ['./grafico-dona-mayores-gastos.component.scss']
})
export class GraficoDonaMayoresGastosComponent {
    option = {
        series: [
            {
                label: {
                    formatter: '{d}%',
                    position: 'inside',
                    fontSize: 15,
                    color: '#fff',
                    fontWeight: 'bold'
                },
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['45%', '80%'],
                data: [
                    {
                        value: 24,
                        name: 'Arriendo',
                        itemStyle: {
                            color: '#77E6E6'
                        }
                    },
                    {
                        value: 13,
                        name: 'Cuentas',
                        itemStyle: {
                            color: '#30CCCC'
                        }
                    },
                    {
                        value: 32,
                        name: 'Deudas',
                        itemStyle: {
                            color: '#17A0A6'
                        }
                    },
                    {
                        value: 9,
                        name: 'Otros',
                        itemStyle: {
                            color: '#FBC974'
                        }
                    },
                    {
                        value: 22,
                        name: 'Alimentación',
                        itemStyle: {
                            color: '#FFEC9C'
                        }
                    }
                ]
            }
        ],
        legend: {
            orient: 'vertical',
            right: 'right'
        }
    };
}
