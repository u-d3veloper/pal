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

# Validate Hugging Face token
hf_token = os.getenv("HUGGINGFACE_TOKEN")
if not hf_token:
    raise ValueError("HUGGINGFACE_TOKEN environment variable is required")

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    max_new_tokens=512,
    do_sample=False,
    repetition_penalty=1.03,
    huggingfacehub_api_token=hf_token,
)
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-large-en-v1.5")

# Configure ChatHuggingFace with proper parameters for streaming
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

# Clear existing vector store before adding new documents
try:
    vector_store.delete_collection()
except:
    pass  # Collection might not exist yet

# Create the collection
vector_store.create_collection()

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
    query: Search
    context: List[Document]
    answer: str


# Define application steps
def analyze_query(state: State):
    structured_llm = chat.with_structured_output(Search)
    query = structured_llm.invoke(state["question"])
    return {"query": query}


def retrieve(state: State):
    query = state["query"]
    retrieved_docs = vector_store.similarity_search(
        query["query"],
        filter={"section": query["section"]},
    )
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = chat.invoke(messages)
    return {"answer": response.content}


# ----------------------------------------------------------------------------# #                          Build and compile the state graph                  # #-----------------------------------------------------------------------------#
graph_builder = StateGraph(State).add_sequence([analyze_query, retrieve, generate])
graph_builder.add_edge(START, "analyze_query")
graph = graph_builder.compile()


for message, metadata in graph.stream(
    {"question": "What is the purpose of the context document?"}, stream_mode="messages"
):
    print(message.content, end="")