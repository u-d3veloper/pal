from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv


from app.services.hf_chat import *
from app.services.mistral_chat import *

load_dotenv()
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

class ChatRequest(BaseModel):
    content: str  

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    # Charger les modèles au démarrage
    configure_mistral_model(hf_repo_id)
    
    print("Modèle chargé avec succès!")
    
    yield
    
    # Nettoyer les modèles à l'arrêt
    clean_hf_models()

# FastAPI setup avec lifespan
app = FastAPI(lifespan=lifespan)

# Ajouter CORS middleware pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permettre toutes les origines, à ajust
    allow_credentials=True,
    allow_methods=["*"],  # Permettre toutes les méthodes HTTP
    allow_headers=["*"],  # Permettre tous les headers
)


# Exemple d'endpoint pour tester le modèle
@app.post("/chat")
async def test_model(request: ChatRequest):
    """Endpoint de test pour vérifier que le modèle fonctionne"""
    if "chat_model" not in ml_models:
        return {"error": "Modèle non chargé"}
    
    chat_model = ml_models["chat_model"]
    messages = [
        HumanMessage(request.conversation)
    ]
    
    try:
        response = ""
        for chunk in chat_model.stream(messages):
            response += chunk.content
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}