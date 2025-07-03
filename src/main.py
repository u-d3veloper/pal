import os
import bs4
from dotenv import load_dotenv
from typing_extensions import List, TypedDict

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

# Index chunks
_ = vector_store.add_documents(documents=all_splits)

# ----------------------------------------------------------------------------# #                          Define state for the application                    # #-----------------------------------------------------------------------------#
prompt = hub.pull("rlm/rag-prompt")


# Define state for application
class State(TypedDict):
    question: str
    context: List[Document]
    answer: str


# Define application steps
def retrieve(state: State):
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = chat.invoke(messages)  # Use chat instead of llm
    return {"answer": response.content}


# ----------------------------------------------------------------------------# #                          Build and compile the state graph                  # #-----------------------------------------------------------------------------#
graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

response = graph.invoke({"question": "What is Task Decomposition?"})
print(response["answer"])
# ----------------------------------------------------------------------------#          #  Uncomment the following lines to test the chat model with a sample message # #-----------------------------------------------------------------------------#

# messages = [
#     ("system", "You are a helpful translator. Translate the user sentence to French."),
#     ("human", "I love programming."),
# ]

# print("=== Invoke Response ===")
# response = chat.invoke(messages)
# print(f"Content: {response.content}")
# print()

# print("=== Streaming Response ===")
# for chunk in chat.stream(messages):
#     print(chunk.content, end="", flush=True)
# print()  # Add a newline at the end
