import React from 'react'

interface MessageProps {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

export default function Message({ content, isUser, timestamp }: MessageProps) {
    return (
        <div
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[70%] rounded-2xl p-4 ${isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                    }`}
            >
                <p className='whitespace-pre-wrap'>{content}</p>
                <span className='text-xs opacity-70 mt-2 block'>
                    {timestamp.toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
}