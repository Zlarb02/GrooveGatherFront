import { CommonModule } from '@angular/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { MessageRequestDto, MessageResponseDto } from '../../shared/models/message.model';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  sentMessages: MessageResponseDto[] = [];
  receivedMessages: MessageResponseDto[] = [];
  newMessage: MessageRequestDto = { receiverName: '', content: '' };
  replyingToMessage: MessageResponseDto | null = null;

  combinedMessages: (MessageResponseDto & { isSent: boolean })[] = [];


  messageService = inject(MessageService);

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
    if (this.newMessage.receiverName && this.newMessage.content) {
      if (this.replyingToMessage) {
        this.newMessage.replyToMessageId = this.replyingToMessage.id;
      } else {
        this.newMessage.replyToMessageId = undefined;
      }

      this.messageService.sendMessage(this.newMessage).subscribe(() => {
        this.loadMessages();
        this.newMessage = { receiverName: '', content: '' };
        this.replyingToMessage = null; // Clear the reply context
      });
    }
  }

  replyToMessage(message: MessageResponseDto): void {
    this.replyingToMessage = message;
    this.newMessage.receiverName = message.senderName;
  }
}
