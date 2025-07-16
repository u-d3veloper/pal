from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ChatMessage(BaseModel):
    role: str = Field(
        ..., description="Role of the message sender (e.g., 'user', 'assistant')"
    )
    content: str = Field(..., description="Content of the chat message")


class ChatResponse(BaseModel):
    messages: List[ChatMessage] = Field(
        ..., description="List of chat messages in the conversation"
    )
