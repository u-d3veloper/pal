'use client'

import { Input } from '@/components/ui/input'
import Opener from '@/components/chat/opener'
import Conversation from '@/components/chat/conversation'
import React, { useState, useRef, useEffect } from 'react'
import { Globe, Plus, SendHorizontal, FilePlus, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import chatApi from '../../services/chatServices';

interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}

export default function ChatPage() {

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [streamingResponse, setStreamingResponse] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingResponse]);

    const addMessage = (content: string, isUser: boolean) => {
        const message: Message = {
            id: Date.now().toString(),
            content,
            isUser,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        addMessage(userMessage, true);
        setIsLoading(true);

        try {
            // Use streaming for better UX
            setIsStreaming(true);
            setStreamingResponse('');

            const result = await chatApi.stream(userMessage, (chunk) => {
                setStreamingResponse(prev => prev + chunk);
            });

            // Add the complete response as a message
            addMessage(result, false);
            setStreamingResponse('');
        } catch (error) {
            console.error('Error in chat:', error);
            addMessage('Désolé, une erreur s\'est produite. Veuillez réessayer.', false);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className='p-4 flex h-full flex-col w-full mx-auto items-center justify-center'>
            {/* Messages Area */}
            <div className='flex-1 w-200 overflow-y-auto mb-4 space-y-4'>
                {messages.length === 0 ? (
                    <Opener />
                ) : (
                    <Conversation messages={messages} />
                )}

                {/* Streaming Response */}
                {isStreaming && (
                    <div className='flex justify-start'>
                        <div className='max-w-[70%] rounded-2xl p-4 bg-muted'>
                            <p className='whitespace-pre-wrap'>
                                {streamingResponse}
                                {streamingResponse && <span className='animate-pulse'>|</span>}
                            </p>
                            <div className='flex items-center gap-2 mt-2'>
                                <Loader2 className='w-3 h-3 animate-spin' />
                                <span className='text-xs opacity-70'>Pal tape...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex w-200 items-center gap-2 flex-col border border-gray-100 rounded-3xl py-2 px-4">
                <form onSubmit={handleSubmit} className='w-full'>
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Show me my recent Notion page about AI..."
                        className='rounded-2xl py-8 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none w-full border-none shadow-none text-base'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                </form>
                <div className='flex w-full justify-between items-center gap-2 p-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Plus className='text-muted-foreground cursor-pointer hover:text-foreground transition-all duration-200' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className='w-64 rounded-2xl'>
                            <DropdownMenuItem className='rounded-xl'>
                                <Globe className='mr-2 h-4 w-4' />
                                Ajouter une source web
                            </DropdownMenuItem>
                            <DropdownMenuItem className='rounded-xl'>
                                <FilePlus className='mr-2 h-4 w-4' />
                                Importer un document
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading || !input.trim()}
                        className='disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isLoading ? (
                            <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
                        ) : (
                            <SendHorizontal className='text-muted-foreground cursor-pointer hover:text-foreground transition-all duration-200' />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
