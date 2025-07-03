import os
import bs4
from dotenv import load_dotenv

from typing import Literal
from typing_extensions import List, TypedDict, Annotated

# Langchain imports
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import PGVector
from langchain import hub
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langgraph.graph import START, StateGraph

# Load environment variables from .env file
load_dotenv()

# ----------------------------------------------------------------------------# #             Models and storage configuration for the RAG system             # #-----------------------------------------------------------------------------#

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    max_new_tokens=512,
    do_sample=False,
    repetition_penalty=1.03,
    huggingfacehub_api_token=os.getenv("HUGGINGFACE_TOKEN"),
)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

chat = ChatHuggingFace(llm=llm, verbose=True)

vector_store = PGVector(
    embeddings=embeddings,
    collection_name="vector_store",
    connection="postgresql://postgres:password@localhost:5432/VectorDB",
)

# ----------------------------------------------------------------------------# #                          Scraping and inserting                             # #-----------------------------------------------------------------------------#

# Load and chunk contents of the blog
loader = WebBaseLoader(
    web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("post-content", "post-title", "post-header")
        )
    ),
)
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
all_splits = text_splitter.split_documents(docs)

# Add metadata to each document based on its position in the list
total_documents = len(all_splits)
third = total_documents // 3

for i, document in enumerate(all_splits):
    if i < third:
        document.metadata["section"] = "beginning"
    elif i < 2 * third:
        document.metadata["section"] = "middle"
    else:
        document.metadata["section"] = "end"

# print(all_splits[0].metadata)

# Index chunks
_ = vector_store.add_documents(documents=all_splits)

# ----------------------------------------------------------------------------# #                          Define state for the application                    # #-----------------------------------------------------------------------------#
prompt = hub.pull("rlm/rag-prompt")

class Search(TypedDict):
    """Search query."""

    query: Annotated[str, ..., "Search query to run."]
    section: Annotated[
        Literal["beginning", "middle", "end"],
        ...,
        "Section to query.",
    ]

# Define state for application
class State(TypedDict):
    question: str
    query : Search
    context: List[Document]
    answer: str


# Define application steps
def retrieve(state: State):
    query = state["query"]
    retrieved_docs = vector_store.similarity_search(
        query["query"],
        filter=lambda doc: doc.metadata.get("section") == query["section"],
    )
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = chat.invoke(messages)  # Use chat instead of llm
    return {"answer": response.content}


# ----------------------------------------------------------------------------# #                          Build and compile the state graph                  # #-----------------------------------------------------------------------------#
graph_builder = StateGraph(State).add_sequence([analyze_query, retrieve, generate])
graph_builder.add_edge(START, "analyze_query")
graph = graph_builder.compile()

for chunk in graph.stream({"question": "What is Task Decomposition?"}): # Stream the response
    print(chunk["answer"], end="", flush=True)
print()  # Add a newline at the end
