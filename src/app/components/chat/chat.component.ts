import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  showChat = false;
  chatForm: FormGroup;
  botIsWriting = false;

  
  toggleChat() {
    this.showChat = !this.showChat;
  }

  messages = [
    {text: 'Hola, ¿cómo estás?', time: '8:40 AM, Hoy', sender: 'other'},
    {text: 'En que te puedo ayudar?', time: '8:55 AM, Hoy', sender: 'other'}
  ];

  constructor() {
    this.chatForm = new FormGroup({
      message: new FormControl(''),
    });
  }

  sendMessage() {
    if (this.chatForm.value.message.trim() !== '') {
      this.messages.push({
        text: this.chatForm.value.message,
        time: new Date().toLocaleTimeString(), // Esto pondrá la hora actual.
        sender: 'me'
      });
      this.chatForm.reset(); // Limpiar el formulario después de enviar.
  
      // Iniciamos el estado de "el bot está escribiendo"
      this.botIsWriting = true;
  
      // Simulamos un delay de 2 segundos (2000 milisegundos)
      setTimeout(() => {
        this.messages.push({
          text: 'Hola, soy el bot.',
          time: new Date().toLocaleTimeString(),
          sender: 'bot'
        });
        // Cuando el bot envía su mensaje, no está "escribiendo" más.
        this.botIsWriting = false;
      }, 3000);
    }
  }
  
}
