// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { Observable } from 'rxjs';
import { Api } from '../models/api';
import type { MessageRequestDto, MessageResponseDto } from '../models/message.model';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private apiUrl = 'messages'; // URL de base pour votre API
    private baseUrl = new Api().local;

    constructor(private http: HttpClient) { }

    // Méthode pour envoyer un message
    sendMessage(request: MessageRequestDto): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(`${this.baseUrl}/${this.apiUrl}/send`, request, { withCredentials: true });
    }

    // Méthode pour récupérer les messages envoyés
    getSentMessages(): Observable<MessageResponseDto[]> {
        return this.http.get<MessageResponseDto[]>(`${this.baseUrl}/${this.apiUrl}/sent`, { withCredentials: true });
    }

    // Méthode pour récupérer les messages reçus
    getReceivedMessages(): Observable<MessageResponseDto[]> {
        return this.http.get<MessageResponseDto[]>(`${this.baseUrl}/${this.apiUrl}/received`, { withCredentials: true });
    }
}
