import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-barra',
  templateUrl: './grafico-barra.component.html',
  styleUrls: ['./grafico-barra.component.scss']
})
export class GraficoBarraComponent {
  @Input() data: any;

  options: any = {
    backgroundColor: '#fff',
    title: {
      text: 'Tu presupuesto /Gasto real',
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}'
    },
    legend: {
      orient: 'horizontal',
      bottom: 20
  },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        data: [],
        itemStyle: {
          color: '#007bff'
        }
      }
    ]
  };

  ngOnChanges() {
    // Asignar los datos de las categorías y los valores a los ejes del gráfico
    this.options.xAxis.data = this.data.map(item => item.name);
    this.options.series[0].data = this.data.map(item => item.value);
  }
}