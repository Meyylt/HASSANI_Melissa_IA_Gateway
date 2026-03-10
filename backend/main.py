import os
import traceback
import fitz  # PyMuPDF
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# 1. Chargement des variables d'environnement (depuis le fichier .env)
load_dotenv()

app = FastAPI()

# Configuration CORS pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Configuration Gemini sécurisée
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("⚠️ ERREUR : La clé GEMINI_API_KEY est introuvable dans le fichier .env")
else:
    genai.configure(api_key=API_KEY)

def get_best_model():
    """Détecte automatiquement le modèle disponible pour ton compte"""
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        for target in ['models/gemini-1.5-flash', 'models/gemini-1.5-pro']:
            if target in models:
                return target
        return models[0] if models else 'gemini-1.5-flash'
    except Exception as e:
        print(f"Erreur lors de la liste des modèles : {e}")
        return 'gemini-1.5-flash'

AVAILABLE_MODEL = get_best_model()
print(f"--- Profila utilise le modèle : {AVAILABLE_MODEL} ---")

@app.post("/analyze")
async def analyze_documents(job_file: UploadFile = File(...), cv_file: UploadFile = File(...)):
    try:
        print("--- Nouvelle analyse lancée ---")
        
        # Lecture de l'offre (.txt)
        job_content = await job_file.read()
        job_text = job_content.decode("utf-8")
        
        # Lecture du CV (.pdf)
        cv_content = await cv_file.read()
        doc = fitz.open(stream=cv_content, filetype="pdf")
        cv_text = "".join([page.get_text() for page in doc])
        
        if not cv_text.strip():
            return {"analysis": "Erreur : Le contenu du CV est illisible ou vide."}

        # Initialisation du modèle détecté
        model = genai.GenerativeModel(model_name=AVAILABLE_MODEL)
        
        # Prompt Minimaliste Noir & Blanc
        prompt = f"""
        Analyse ce CV par rapport a l'offre d'emploi suivante. 
        Reponds de maniere ultra-minimaliste, sans introduction, sans conclusion et SANS EMOJIS.
        
        STRUCTURE :
        SCORE DE MATCH : [X]/100
        
        ELEMENTS A CONSERVER :
        - [Texte court]
        
        ELEMENTS A AMELIORER :
        - [Action precise]

        OFFRE : {job_text}
        CV : {cv_text}
        """
        
        response = model.generate_content(prompt)
        
        print("Analyse réussie.")
        return {"analysis": response.text}

    except Exception as e:
        print("!!! ERREUR SERVEUR !!!")
        print(traceback.format_exc())
        return {"error": str(e)}

@app.get("/")
def health_check():
    return {
        "status": "online",
        "model_active": AVAILABLE_MODEL,
        "api_key_loaded": API_KEY is not None
    }