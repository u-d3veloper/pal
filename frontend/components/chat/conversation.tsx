import React from 'react'
import Message from '@/components/chat/message'

interface ConversationProps {
    messages: {
        id: string;
        content: string;
        isUser: boolean;
        timestamp: Date;
    }[];
}

export default function Conversation({ messages }: ConversationProps) {
    return (
        <>
            {messages.map((message) => (
                <Message key={message.id} content={message.content} isUser={message.isUser} timestamp={message.timestamp} />
            ))}
        </>
    )
}
