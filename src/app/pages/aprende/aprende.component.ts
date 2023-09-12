import { Component } from '@angular/core';

@Component({
  selector: 'app-aprende',
  templateUrl: './aprende.component.html',
  styleUrls: ['./aprende.component.scss']
})
export class AprendeComponent {


  cards = [
    { title: 'Card 1', content: 'Contenido de la Card 1', imageUrl: 'https://t4.ftcdn.net/jpg/03/06/71/93/240_F_306719380_KH1U3j9zh6Oa5T3vNt5GlcGoLGrZ2REC.jpg' },
    { title: 'Card 2', content: 'Contenido de la Card 2', imageUrl: 'https://t4.ftcdn.net/jpg/03/06/71/93/240_F_306719380_KH1U3j9zh6Oa5T3vNt5GlcGoLGrZ2REC.jpg' },
    { title: 'Card 3', content: 'Contenido de la Card 3', imageUrl: 'https://t4.ftcdn.net/jpg/03/06/71/93/240_F_306719380_KH1U3j9zh6Oa5T3vNt5GlcGoLGrZ2REC.jpg' },
    { title: 'Card 4', content: 'Contenido de la Card 4', imageUrl: 'https://t4.ftcdn.net/jpg/03/06/71/93/240_F_306719380_KH1U3j9zh6Oa5T3vNt5GlcGoLGrZ2REC.jpg' },
    { title: 'Card 5', content: 'Contenido de la Card 5', imageUrl: 'https://t4.ftcdn.net/jpg/03/06/71/93/240_F_306719380_KH1U3j9zh6Oa5T3vNt5GlcGoLGrZ2REC.jpg' },
    { title: 'Card 6', content: 'Contenido de la Card 6', imageUrl: 'https://t4.ftcdn.net/jpg/03/06/71/93/240_F_306719380_KH1U3j9zh6Oa5T3vNt5GlcGoLGrZ2REC.jpg' },
    // Agrega más tarjetas aquí
  ];

  // Divide el arreglo de tarjetas en grupos de 3
  cardGroups = [];

  constructor() {
    for (let i = 0; i < this.cards.length; i += 3) {
      this.cardGroups.push(this.cards.slice(i, i + 3));
    }
  }

  get indicatorIndexes() {
    return Array(this.cardGroups.length).fill(0).map((x, i) => i);
  }
}
