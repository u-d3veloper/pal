
from fastapi.responses import StreamingResponse
from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models.QueryModels import Query
from .lib.query import call_llm, stream_content

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.post("/query/stream")
async def stream_query(query: Query):
    return StreamingResponse(stream_content(query), media_type="text/plain")

@app.post("/query")
async def query_items(query: Query):
    response = await call_llm(query)
    return {"response": response, "query": query.content}