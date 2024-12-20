import {Component, QueryList} from '@angular/core';
import {FormGroup, FormControl, AbstractControl} from '@angular/forms';
import {ChatBotService} from '@services/chat-bot.service';
import {ViewChild, ElementRef, ViewChildren} from '@angular/core';
import { PlanesService } from '@services/planes/planes.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    @ViewChildren('msg') messagesElements: QueryList<ElementRef>;

    showChat = false;
    chatForm: FormGroup;
    plan: any;
    botIsWriting = false;
    placeholderText = 'Escribe un mensaje...';


    toggleChat() {
        this.showChat = !this.showChat;
    }

    getCurrentTime() {
        const fecha = new Date();
        fecha.setHours(fecha.getHours() + 1); // Agrega una hora
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds();

        const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos
            .toString()
            .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        return horaFormateada;
    }

    messages = [
        {
            text: 'Hola, ¿cómo estás? En que te puedo ayudar?',
            time: this.getCurrentTime(),
            sender: 'other'
        }
    ];

    constructor(private chatbotService: ChatBotService, private planService: PlanesService) {
        this.chatForm = new FormGroup({
            message: new FormControl({ value: '', disabled: true })
        });
        this.obtenerPlan();
        this.miHistorial();
    }

    sendMessage() {
        const pregunta = this.chatForm.value.message.trim();

        if (pregunta !== '') {
            // Crea el objeto con la estructura que necesitas enviar
            const messageObject = {
                question: pregunta,
                userId: JSON.parse(sessionStorage.getItem('user')).user.id, // Aquí puedes modificarlo según sea necesario
                year: new Date().getFullYear(), // Establece el año actual
                month: new Date().getMonth() + 1,
                token: JSON.parse(sessionStorage.getItem('user')).access_token

                // Establece el mes actual (meses empiezan en 0)
            };

            this.messages.push({
                text: this.chatForm.value.message,
                time: this.getCurrentTime(),
                sender: 'me'
            });

            this.scrollToBottom();
            this.chatForm.reset();

            this.botIsWriting = true;

            // Envía el objeto completo al servicio
            this.chatbotService.obtenerRespuesta(messageObject).subscribe({
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

    miHistorial() {
        const userId = JSON.parse(sessionStorage.getItem('user')).user.id;
    
        this.chatbotService.obtenerHistorial(userId).subscribe({
            next: (resp: any) => {
                if (resp && resp.length > 0) {
                    this.messages = resp.map((msg: any) => ({
                        text: msg.message,
                        time: this.formatToTime(msg.createdAt),
                        sender: msg.isChatGpt ? 'bot' : 'me'
                    }));
                } else {
                    this.messages = [
                        {
                            text: 'Hola, ¿cómo estás? En que te puedo ayudar?',
                            time: this.getCurrentTime(),
                            sender: 'other'
                        }
                    ];
                }
                this.scrollToBottom();
            },
            error: () => {
                console.error('Error al obtener el historial.');
            }
        });
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

    obtenerPlan() {
        this.planService.miPlan().subscribe({
            next: (resp: any) => {
                this.plan = resp;
                if (resp && Object.keys(resp).length > 0) {
                    this.chatForm.get('message')?.enable();
                    this.placeholderText = 'Escribe un mensaje...';
                } else {
                    this.chatForm.get('message')?.disable();
                    this.placeholderText = 'No puedes usar esta funcionalidad';
                }
            },
            error: () => {
                this.chatForm.get('message')?.disable();
                this.placeholderText = 'Actualiza tu plan para enviar mensajes.';
            }
        });
    }
    
}
