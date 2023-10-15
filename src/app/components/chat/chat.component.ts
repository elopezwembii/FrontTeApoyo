import {Component, QueryList} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {ChatBotService} from '@services/chat-bot.service';
import {ViewChild, ElementRef, ViewChildren} from '@angular/core';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    @ViewChildren('msg') messagesElements: QueryList<ElementRef>;

    showChat = false;
    chatForm: FormGroup;
    botIsWriting = false;

    toggleChat() {
        this.showChat = !this.showChat;
    }

    getCurrentTime() {
        const now = new Date();
    
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
    
        return `${hours}:${minutes}:${seconds}`;
    }

    messages = [
        {
            text: 'Hola, ¿cómo estás? En que te puedo ayudar?',
            time: this.getCurrentTime(),
            sender: 'other'
        }
    ];

    constructor(private chatbotService: ChatBotService) {
        this.chatForm = new FormGroup({
            message: new FormControl('')
        });
    }

    sendMessage() {
        const pregunta = this.chatForm.value.message.trim();

        if (pregunta !== '') {
            this.messages.push({
                text: this.chatForm.value.message,
                time: new Date().toLocaleTimeString(),
                sender: 'me'
            });

            this.scrollToBottom();
            this.chatForm.reset();

            this.botIsWriting = true;

            this.chatbotService.obtenerRespuesta(pregunta).subscribe({
                next: ({author, fecha, response}: any) => {
                    this.messages.push({
                        text: response,
                        time: this.formatToTime(fecha),
                        sender: 'bot'
                    });
                    this.botIsWriting = false;
                    this.scrollToBottom();
                }
            });
        }
    }

    formatToTime = (fechaCompleta: string): string => {
        const fecha = new Date(fechaCompleta);
        const horas = fecha.getUTCHours();
        const minutos = fecha.getUTCMinutes();
        const segundos = fecha.getUTCSeconds();

        const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos
            .toString()
            .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        return horaFormateada;
    };

    scrollToBottom(): void {
        try {
            this.messagesElements.last.nativeElement.scrollIntoView({
                behavior: 'smooth'
            });
        } catch (err) {}
    }
    ngAfterViewInit() {
        this.messagesElements.changes.subscribe((elements) => {
            this.scrollToBottom();
        });
    }
}
