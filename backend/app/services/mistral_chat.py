from langchain.chat_models import init_chat_model
import os
from dotenv import load_dotenv

load_dotenv()

MISTRALAI_API_KEY = os.getenv("MISTRALAI_API_KEY")

model_provider = "mistralai"
model_id = "mistral-small-2501"

ml_models = {}

def configure_mistral_model(model_id=model_id, model_provider=model_provider):
    # Charger le modèle au démarrage
    print(f"Chargement du modèle {model_provider}/{model_id}...")
    
    llm = init_chat_model(
        model_id, 
        model_provider
    )
    
    # Stocker le modèle dans le dictionnaire global
    ml_models["chat_model"] = llm

def clean_hf_models():
    print("Nettoyage des modèles...")
    ml_models.clear()

