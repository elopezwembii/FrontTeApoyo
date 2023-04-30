import {Component} from '@angular/core';

@Component({
    selector: 'app-ahorros',
    templateUrl: './ahorros.component.html',
    styleUrls: ['./ahorros.component.scss']
})
export class AhorrosComponent {
  ahorros = [
    {
      nombre: 'Ahorro para vacaciones',
      progreso: 25
    },
    {
      nombre: 'Ahorro para comprar un coche',
      progreso: 50
    },
    {
      nombre: 'Ahorro para la universidad',
      progreso: 75
    }
  ];
  
}
