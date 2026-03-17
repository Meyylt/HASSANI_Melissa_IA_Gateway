# Profila - Analyseur de CV par Intelligence Artificielle
Cette application web Full Stack permet d'analyser intelligemment la compatibilité entre un CV (au format PDF) et une offre d'emploi (au format texte). En s'appuyant sur l'IA générative.

# Fonctionnalités principales
- **Analyse Sémantique Avancée :** Utilisation de l'API Gemini pour évaluer la pertinence d'un profil par rapport aux attentes réelles d'une offre.
- **Extraction PDF :** Lecture et extraction automatique du texte des CV directement depuis le backend.
- **Interface Minimaliste & UX Design :** Une interface utilisateur épurée en noir et blanc, pensée pour l'efficacité, avec un scroll automatique vers les résultats.
- **Architecture Séparée :** Communication fluide entre un backend robuste (Python/FastAPI) et un frontend réactif (React).

  
# Prérequis
Avant de lancer le projet, assurez-vous d'avoir installé : 
- **Node.js** & **npm**
- **Python 3.9** ou supériere
- Une clé d'API Google Gemini valide.

### Installation 
Clonez le dépot de l'application sur votre machine.

```bash
git clone https://github.com/Meyylt/HASSANI_Melissa_IA_Gateway.git
cd HASSANI_Melissa_IA_Gateway
```
### Configuration du Backend (FastAPI)

```bash
cd backend
```

**Créez et activez un environnement virtuel**
```bash
python -m venv venv
# Sur Windows :
.\venv\Scripts\activate
```
Si PowerShell bloque l'exécution, forcez avec le chemin absolu lors du lancement.

**Installez les dépendances requises**
```bash
pip install -r requirements.txt
```

### Configuration du frontend (React)

**Ouvrez un second terminal à la racine du projet et placez-vous dans le dossier frontend**
```bash
cd frontend
npm install
```

### Configuration de l'API 
**Dans le dossier backend/, créez un fichier nommé .env. Ajoutez-y votre clé API Gemini de cette manière :**
```bash
GEMINI_API_KEY=votre_cle_api_ici
```

### Utilisation 
Pour que l'application fonctionne, les deux serveurs doivent tourner en simultané dans deux terminaux séparés.

**Terminal 1: Lancer le backend**
```bash
python -m uvicorn main:app --reload
```

**Terminal 2: Lancer le frontend**
```bash
npm run dev
```

### Structure du projet 
- **Backend/ :** Contient la logique serveur (FastAPI), la gestion du PDF (PyMuPDF) et les appels au LLM Gemini.

- **Frontend/ :** Interface utilisateur développée en React.

- **Journal_IA.md :** Journal de bord détaillant les choix d'architecture, les itérations de prompt engineering et les résolutions de bugs rencontrés pendant le développement.


