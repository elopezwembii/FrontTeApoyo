import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {ChatBotRequest} from './chatbot.interface';

const url = `${environment.uri_api_v2}/chatbot`;
const apiKey = `${environment.api_key}`;

@Injectable({
    providedIn: 'root'
})
export class ChatBotService {
    constructor(private http: HttpClient) {}

    obtenerRespuesta(data: ChatBotRequest) {
        return this.http.post(`${url}/ask`, data, {
            headers: {
                Authorization:
                    'Bearer ' +
                    apiKey
            }
        });
    }

    obtenerHistorial(userId: string) {
        return this.http.get(`${url}/chatbot-history?userId=${userId}`, {
            headers: {
                Authorization: 
                'Bearer ' +
                    apiKey
            }
        })
    }
}
