import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import HumanMessage
from langchain_core.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


load_dotenv()
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

hf_repo_id = "DeepSeek-AI/DeepSeek-R1"  # ID du modèle HuggingFace à charger
# Dictionnaire global pour stocker les modèles
ml_models = {}

def configure_hf_model(repo_id=hf_repo_id):
    # Charger le modèle au démarrage
    print(f"Chargement du modèle {repo_id}...")
    
    # Créer d'abord un HuggingFaceEndpoint sans spécifier de task
    llm = HuggingFaceEndpoint(
        repo_id=repo_id,
        max_new_tokens=512,
        top_k=10,
        top_p=0.95,
        temperature=0.01,
        repetition_penalty=1.03,
        huggingfacehub_api_token=HUGGINGFACE_TOKEN,
        streaming=True,
    )

    # Utiliser ChatHuggingFace pour wrapper le endpoint en tant que chat model
    chat_model = ChatHuggingFace(
        llm=llm,
        verbose=True
    )
    
    # Stocker le modèle dans le dictionnaire global
    ml_models["chat_model"] = chat_model
    ml_models["llm"] = llm

def clean_hf_models():
    print("Nettoyage des modèles...")
    ml_models.clear()


