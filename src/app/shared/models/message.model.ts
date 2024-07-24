export interface MessageRequestDto {
    receiverId?: number; // Changement de receiverName à receiverId
    receiverName: string;
    content: string;
    replyToMessageId?: number; // Ajouté pour la réponse
}

export interface MessageResponseDto {
    id: number;
    content: string;
    timestamp: string; // Vous pouvez aussi utiliser `Date` si vous préférez
    senderId: number; // Changement de senderName à senderId
    senderName: string;
    senderPicture: string;
    receiverId?: number; // Changement de receiverName à receiverId
    receiverName?: string;
    receiverPicture?: string;
    replyToMessageId?: number; // Ajouté pour la réponse
    replyToMessageContent?: string; // Ajouté pour le contenu du message auquel il répond
}
