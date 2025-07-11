from ..models.QueryModels import Prompt
from ...services.chat import call_model, stream_model

async def stream_content(prompt: Prompt):
    """Stream content from the model in real-time"""
    try:
        async for chunk in stream_model(prompt.content):
            if chunk:  # Only yield non-empty chunks
                yield chunk.encode("utf-8")
    except Exception as e:
        print(f"Error in stream_content: {e}")
        # Fallback to regular response
        response = await call_model(prompt.content)
        yield response.encode("utf-8")