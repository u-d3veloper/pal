import os
from dotenv import load_dotenv

from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()

# Create the endpoint first
endpoint = HuggingFaceEndpoint(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    api_key=os.environ["HUGGINGFACE_TOKEN"],
    timeout=120
)

# Create the chat model with the endpoint as llm
model = ChatHuggingFace(
    llm=endpoint,
    streaming=True,
)

async def call_model(prompt: str) -> str:
    response = await model.ainvoke(
        input=[
            SystemMessage(content="You are Pal, a helpful assistant from University Administration that help students with their questions."),
            HumanMessage(content=prompt)
        ]
    )
    return response.content

async def stream_model(prompt: str):
    """Stream the model response chunk by chunk"""
    messages = [
        SystemMessage(content="You are Pal, a helpful assistant from University Administration that help students with their questions."),
        HumanMessage(content=prompt)
    ]
    
    try:
        async for chunk in model.astream(messages):
            if chunk.content:
                yield chunk.content
    except Exception as e:
        print(f"Error in streaming: {e}")
        # Fallback to non-streaming response
        response = await model.ainvoke(messages)
        yield response.content