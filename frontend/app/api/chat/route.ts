import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Create a ReadableStream for streaming the response
        const stream = new ReadableStream({
            start(controller) {
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                function pump(): any {
                    return reader?.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        controller.enqueue(new TextEncoder().encode(chunk));
                        return pump();
                    }).catch((error) => {
                        console.error('Stream error:', error);
                        controller.error(error);
                    });
                }

                return pump();
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (error) {
        console.error('Error calling backend:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
