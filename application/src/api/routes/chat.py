from fastapi.responses import StreamingResponse
from ..lib.chat import call_llm, stream_content
from ..models.QueryModels import Prompt


def create_chat_routes(app):
    @app.post("/chat")
    async def chat(prompt: Prompt):
        return StreamingResponse(stream_content(prompt), media_type="text/plain")