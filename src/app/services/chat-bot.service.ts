import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { environment } from 'environments/environment';


const url = environment.url_api_chatbot;

@Injectable({
    providedIn: 'root'
})
export class ChatBotService {
    constructor(private http: HttpClient) {}

    obtenerRespuesta(mensaje: string) {
        return this.http.post(url, {mensaje});
    }
}
