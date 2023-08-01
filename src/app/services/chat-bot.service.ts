import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

const url = 'http://localhost:3000/api/chatbot';

@Injectable({
    providedIn: 'root'
})
export class ChatBotService {
    constructor(private http: HttpClient) {}

    obtenerRespuesta(mensaje: string) {
        return this.http.post(url, {mensaje});
    }
}
