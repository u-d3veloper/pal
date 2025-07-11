from ..models.QueryModels import Query
from ...core.chat import call_model, stream_model


async def call_llm(query: Query) -> str:
    response = await call_model(query.content)
    return response


async def stream_content(query: Query):
    """Stream content from the model in real-time"""
    try:
        async for chunk in stream_model(query.content):
            if chunk:  # Only yield non-empty chunks
                yield chunk.encode("utf-8")
    except Exception as e:
        print(f"Error in stream_content: {e}")
        # Fallback to regular response
        response = await call_model(query.content)
        yield response.encode("utf-8")