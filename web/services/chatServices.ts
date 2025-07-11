const chatApi = {
    stream: async (content: string, onChunk?: (chunk: string) => void) => {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error("No reader available");
        }

        let result = '';

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                result += chunk;

                if (onChunk) {
                    onChunk(chunk);
                }
            }
        } finally {
            reader.releaseLock();
        }

        return result;
    },
};

export default chatApi;
