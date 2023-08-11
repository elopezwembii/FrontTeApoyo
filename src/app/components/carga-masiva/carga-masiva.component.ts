import { Component } from '@angular/core';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent {
  previewData: any; // Puedes usar un tipo más específico si es necesario

  constructor() { }

  openModal() {

  }

  closeModal() {

  }

  handleFileInput(files: FileList) {
    const file = files.item(0);
    // Procesar y generar una vista previa de los datos si es necesario
  }

  submitFile() {
    // Lógica para enviar el archivo al servidor
  }
}
