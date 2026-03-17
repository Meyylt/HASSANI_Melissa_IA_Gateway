# Journal de Développement - Projet 6

## Session 1 — Objectif : Initialiser le frontend avec mon projet figma
- **Avant le code :** Avant d'avoir commencé a codé j'ai essayé de faire une interface avec figma pour visualiser mon projet et voir comment je pourrais placer mon IA, j'ai ensuite envoyé une capture d'écran de mon interface a Gemini et je lui est demandé de me coder l'interface en utilisant React et Tailwind CSS.
- **Prompt :** "Voila mon interface pour mon application aide moi a coder le frontend en utilisant React et Tailwind CSS, je t'es mis en piece jointe mon idée du projet on y va étape par étape."
- **Problème :** j'ai pas eu de problème a cette étape la l'IA m'a bien généré le front, il était pas compatible a 100% avec la capture d'écran que j'ai envoyé donc j'ai du ajuster tout ça de mon coté. 


## Session 2 — Objectif : Faire le lien entre le backend & le frontend, et reglage de faille lié a la clé API

- **Prompt :** "fais moi le backend de mon appli, je veux que l'ia analyse le cv (pdf) par rapport a l'offre d'emploi  et me donne un score et des conseils, je veux pouvoir mettre le lien d'une annonce directement dans le site."
- **Problème :** J'ai dû faire face au **Web Scraping** des sites d'emploi qui bloquaient l'accès aux données **(erreurs 403 Forbidden, protections anti-scraping)**, ce qui empêchait l'IA de lire l'annonce directement depuis l'URL.
- **Solution :** je suis passée a une autre solution qui était plus rapide et c'était de juste mettre des fichiers txt en offre, ca a resolu le problème, je me suis dis que je pourrais envisager de trouver une solution au scraping plus tard.

- **Prompt :** "Mon backend me renvoie 200 OK mais le resultat de l'analyse ne s'affiche pas sur mon site react"
- **Problème :** La connexion entre le front et le back semblait marcher car mon serveur me renvoyait un code de succès "200 OK" quand j'envoyais les fichiers. Sauf que l'analyse ne s'affichait pas. C'était un problème de parsing JSON et de gestion d'état dans mon composant.
- **Solution :** J'ai dû débugger ma fonction de `fetch (handleAnalysis)`. Il fallait bien extraire les données asynchrones avec `await response.json()` et surtout m'assurer que la clé correspondait bien à ce que le back envoyait pour mettre à jour mon state avec `setAnalysisResult()`.

- **Prompt :** Comment je fais pour que l'IA comprenne quand il ya des concepts qui sont pareils mais que le mon utilisé pour les deux n'est pas le méme par exemple "Developpeur js" et "React" qu'elle fasse pas juste chercher des mots clés exacts ?
- **Problème :** Je craignais que l'IA se comporte comme un vieux script et se contente de comparer le CV et l'offre "mot pour mot".
- **Solution :** On a concu un prompt qui force l'IA à analyser la sémantique et les compétences globales, ce qui a rendu le score de compatibilité beaucoup plus intelligent et proche de la réalité. 


- **Prompt :** ma clé API est en dur dans mon code **main.py**
- **Problème :** avant de faire le premier push sur git je me suis rendu compte que j'avais ma clé API en dur dans mon code. 
- **Solution :**  J'ai installé la bibliothèque `python-dotenv`. J'ai créé un fichier `.env` pour y stocker ma clé en sécurité (et je l'ai mis dans le .gitignore pour ne pas le push), puis j'ai modifié mon code Python pour qu'il aille la lire de manière invisible avec `os.getenv()`.

  
## Session 3 — Objectif: Reglage de conflit des environnements virtuels (Backend)
- **Prompt :** "".\venv\Scripts\activate n'est pas reconnu..." suivi de "No module named uvicorn" quand j'essayais de lancer le serveur."
- **Problème :** J'ai eu un gros conflit avec mes environnements virtuels Python. Mon projet avait un dossier .venv à la racine et un dossier venv dans le backend. PowerShell bloquait l'activation, et le terminal ne trouvait pas mes bibliothèques installées car il ne pointait pas vers le bon dossier Python.
- Solution : Au lieu d'essayer d'activer l'environnement avec la méthode classique qui marchait pas, j'ai forcé Windows à utiliser le bon chemin absolu `(.\venv\Scripts\python.exe -m uvicorn main:app --reload)` directement depuis le dossier backend. Ça a contourné les blocages système.

