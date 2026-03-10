from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import fitz  # PyMuPDF
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURATION GEMINI ---
API_KEY = "AIzaSyB-U8pHpASTWe2n9zQAPo7uDoXphCYIgDA"
genai.configure(api_key=API_KEY)

def get_best_model():
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        for target in ['models/gemini-1.5-flash', 'models/gemini-1.5-pro']:
            if target in models: return target
        return models[0] if models else 'gemini-1.5-flash'
    except: return 'gemini-1.5-flash'

AVAILABLE_MODEL = get_best_model()

@app.post("/analyze")
async def analyze_documents(job_file: UploadFile = File(...), cv_file: UploadFile = File(...)):
    try:
        job_content = await job_file.read()
        job_text = job_content.decode("utf-8")
        
        cv_content = await cv_file.read()
        doc = fitz.open(stream=cv_content, filetype="pdf")
        cv_text = "".join([page.get_text() for page in doc])
        
        model = genai.GenerativeModel(model_name=AVAILABLE_MODEL)
        
        # Prompt Minimaliste sans émojis
        prompt = f"""
        Analyse ce CV par rapport a l'offre. 
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
        return {"analysis": response.text}
    except Exception as e:
        print(traceback.format_exc())
        return {"error": str(e)}