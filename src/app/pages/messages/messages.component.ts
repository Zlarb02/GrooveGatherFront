import { CommonModule, NgClass } from '@angular/common';
// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient } from '@angular/common/http';
// biome-ignore lint/style/useImportType: <explanation>
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { Api } from '../../shared/models/api';
import type { MessageRequestDto, MessageResponseDto } from '../../shared/models/message.model';
// biome-ignore lint/style/useImportType: <explanation>
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  sentMessages: MessageResponseDto[] = [];
  receivedMessages: MessageResponseDto[] = [];
  newMessage: MessageRequestDto = { receiverId: 0, content: '' }; // Utilisation de receiverId
  replyingToMessage: MessageResponseDto | null = null;

  combinedMessages: (MessageResponseDto & { isSent: boolean })[] = [];

  constructor(private messageService: MessageService, private http: HttpClient) { }

  api = new Api();
  baseUrl = this.api.local;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getSentMessages().subscribe(sentMessages => {
      const formattedSentMessages = sentMessages.map(message => ({ ...message, isSent: true }));
      this.messageService.getReceivedMessages().subscribe(receivedMessages => {
        const formattedReceivedMessages = receivedMessages.map(message => ({ ...message, isSent: false }));
        this.combinedMessages = [...formattedSentMessages, ...formattedReceivedMessages]
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      });
    });
  }

  sendMessage(): void {
    if (this.newMessage.receiverId && this.newMessage.content) {
      if (this.replyingToMessage) {
        this.newMessage.replyToMessageId = this.replyingToMessage.id;
      } else {
        this.newMessage.replyToMessageId = undefined;
      }

      this.messageService.sendMessage(this.newMessage).subscribe(() => {
        this.loadMessages();
        this.newMessage = { receiverId: 0, content: '' };
        this.replyingToMessage = null; // Clear the reply context
      });
    }
  }

  replyToMessage(message: MessageResponseDto): void {
    this.replyingToMessage = message;
    this.newMessage.receiverId = message.senderId; // Utilisation de receiverId
  }

  // Méthodes pour accepter ou rejeter les demandes
  acceptRequest(messageId: number): void {
    this.http.put(`${this.baseUrl}/projects/response`,
      { messageId, accepted: true },
      { withCredentials: true })
      .pipe(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        map((response: any) => response.message),
        catchError(error => {
          console.error('Error accepting request', error);
          return [];
        })
      )
      .subscribe(message => {
        this.loadMessages(); // Reload messages after processing the response
      });
  }

  rejectRequest(messageId: number): void {
    this.http.put(`${this.baseUrl}/projects/response`,
      { messageId, accepted: false },
      { withCredentials: true })
      .pipe(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        map((response: any) => response.message),
        catchError(error => {
          console.error('Error rejecting request', error);
          return [];
        })
      )
      .subscribe(message => {
        this.loadMessages(); // Reload messages after processing the response
      });
  }

}  