import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000'; // Adjust to your FastAPI server port

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/query/stream`, {
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

                function pump(): any {
                    return reader?.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        return pump();
                    });
                }

                return pump();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Error calling backend stream:', error);
        return NextResponse.json(
            { error: 'Failed to process streaming query' },
            { status: 500 }
        );
    }
}
