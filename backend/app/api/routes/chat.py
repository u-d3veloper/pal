from fastapi.responses import StreamingResponse
from ...services.chat import call_model, stream_model
from ..models.QueryModels import Prompt


def create_chat_routes(app):
    @app.post("/chat")
    async def chat(prompt: Prompt):
        return StreamingResponse(stream_model(prompt.content), media_type="text/plain")