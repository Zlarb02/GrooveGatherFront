export interface MessageRequestDto {
    receiverName: string;
    content: string;
    replyToMessageId?: number; // Ajouté pour la réponse
}

export interface MessageResponseDto {
    id: number;
    content: string;
    timestamp: string; // Vous pouvez aussi utiliser `Date` si vous préférez
    senderName: string;
    senderPicture: string;
    receiverName?: string;
    receiverPicture?: string;
    replyToMessageId?: number; // Ajouté pour la réponse
    replyToMessageContent?: string; // Ajouté pour le contenu du message auquel il répond
}
