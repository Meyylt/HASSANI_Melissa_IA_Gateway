# Journal de Développement - Analyseur de CV

## Ma Vision du projet: 
Avant de commencer le journal, je tenais à clarifier ma perspective sur ce projet car je l'ai modifié par rapport à ce qui a été demandé.
J'ai fait mon projet dans le but que ça soit utile aux personnes qui veulent postuler à des offres de travail, pour qu'elles puissent savoir si leur CV est compatible avec les critères des recruteurs et savoir ce qu'il faut modifier.
Je voulais plutôt partir sur un chatbot pour que ça soit plus expressif au niveau des conseils, mais je n'ai pas eu le temps d'implémenter tout ça et j'ai préféré rendre un projet propre et fonctionnel plutôt que quelque chose de plus avancé mais qui marche à moitié.

### Structure du journal

Nous avons eu trois séances pour finaliser le projet, j'ai donc pour chaque séance créé une session qui contient les prompts les plus importants que j'ai faits et les problèmes rencontrés.

## Session 1 — Objectif : Initialiser le frontend avec mon projet figma
- **Avant le code :** Avant d'avoir commencé a codé j'ai essayé de faire une interface avec figma pour visualiser mon projet et voir comment je pourrais placer mon IA, j'ai ensuite envoyé une capture d'écran de mon interface a Gemini et je lui est demandé de me coder l'interface en utilisant React et Tailwind CSS.
- **Prompt :** "Voila mon interface pour mon application aide moi a coder le frontend en utilisant React et Tailwind CSS, je t'es mis en piece jointe mon idée du projet on y va étape par étape."
- **Problème :** j'ai pas eu de problème a cette étape la l'IA m'a bien généré le front, il était pas compatible a 100% avec la capture d'écran que j'ai envoyé donc j'ai du ajuster tout ça de mon coté en ajustant les alignement et le code CSS. 


## Session 2 — Objectif : Faire le lien entre le backend & le frontend, et reglage de faille lié a la clé API
-**Ce que je voulais faire :** Je voulais pouvoir coller des liens d'annonces directement dans mon site.

1 - **Prompt :** "fais moi le backend de mon appli, je veux que l'ia analyse le cv (pdf) par rapport a l'offre d'emploi  et me donne un score et des conseils, je veux pouvoir mettre le lien d'une annonce directement dans le site."
- **Problème :** J'ai dû faire face au **Web Scraping** des sites d'emploi qui bloquaient l'accès aux données **(erreurs 403 Forbidden, protections anti-scraping)**, ce qui empêchait l'IA de lire l'annonce directement depuis l'URL.
- **Solution :** je suis passée a une autre solution qui était plus rapide et c'était de juste mettre des fichiers txt en offre, ca a resolu le problème, je me suis dis que je pourrais envisager de trouver une solution au scraping plus tard.
- **Ce que j'ai retenu :** J'ai appris que les pages web protègent activement leurs données. J'ai aussi compris qu'en développement, il faut savoir s'adapter quand un obstacle gêne le développement du projet.
  
2 - **Prompt :** "Mon backend me renvoie 200 OK mais le resultat de l'analyse ne s'affiche pas sur mon site react"
- **Problème :** La connexion entre le front et le back semblait marcher car mon serveur me renvoyait un code de succès "200 OK" quand j'envoyais les fichiers. Sauf que l'analyse ne s'affichait pas. C'était un problème de parsing JSON et de gestion d'état dans mon composant.
- **Solution :** J'ai dû débugger ma fonction de `fetch (handleAnalysis)`. Il fallait bien extraire les données asynchrones avec `await response.json()` et surtout m'assurer que la clé correspondait bien à ce que le back envoyait pour mettre à jour mon state avec `setAnalysisResult()`.

3 - **Prompt :** Comment je fais pour que l'IA comprenne quand il ya des concepts qui sont pareils mais que le mon utilisé pour les deux n'est pas le méme par exemple "Developpeur js" et "React" qu'elle fasse pas juste chercher des mots clés exacts ?
- **Problème :** Je craignais que l'IA se comporte comme un vieux script et se contente de comparer le CV et l'offre "mot pour mot".
- **Solution :** On a concu un prompt qui force l'IA à analyser la sémantique et les compétences globales, ce qui a rendu le score de compatibilité beaucoup plus intelligent et proche de la réalité.
- **Le prompt que j'ai amélioré dans mon projet :** "Agis comme un recruteur expert. Ne fais pas que chercher des mots-clés exacts. Évalue la sémantique et les compétences transférables"


4 - **Prompt :** ma clé API est en dur dans mon code **main.py**
- **Problème :** avant de faire le premier push sur git je me suis rendu compte que j'avais ma clé API en dur dans mon code. 
- **Solution :**  J'ai installé la bibliothèque `python-dotenv`. J'ai créé un fichier `.env` pour y stocker ma clé en sécurité (et je l'ai mis dans le .gitignore pour ne pas le push), puis j'ai modifié mon code Python pour qu'il aille la lire de manière invisible avec `os.getenv()`.
- **Ce que j'ai retenu :** La gestion des secrets (.env) est primordiale avant tout versioning. C'est un réflexe que je n'avais pas et qui aurait pu exposer mon compte.

  
## Session 3 — Objectif: Reglage de conflit des environnements virtuels (Backend)
- **Prompt :** "".\venv\Scripts\activate n'est pas reconnu..." suivi de "No module named uvicorn" quand j'essayais de lancer le serveur."
- **Problème :** J'ai eu un gros conflit avec mes environnements virtuels Python. Mon projet avait un dossier .venv à la racine et un dossier venv dans le backend. PowerShell bloquait l'activation, et le terminal ne trouvait pas mes bibliothèques installées car il ne pointait pas vers le bon dossier Python.
- **Solution** : Au lieu d'essayer d'activer l'environnement avec la méthode classique qui marchait pas, j'ai forcé Windows à utiliser le bon chemin relatif `(.\venv\Scripts\python.exe -m uvicorn main:app --reload)` directement depuis le dossier backend. Ça a contourné les blocages système.
- La solution la plus optimale aurait été de créer un exécutable standalone, mais dans le cadre du projet, j'ai opté pour l'utilisation d'un environnement virtuel afin de pouvoir exécuter directement le script, étant donné que dans un exécutable standalone on n'a pas accès au code source.

## Finalité du projet
Le projet est fonctionnel en local, mais mon objectif aurait été de le déployer en ligne (le frontend sur Vercel et le backend sur Render, par exemple) pour qu'il soit réellement utilisable par d'autres étudiants, ou juste par des personnes qui ont besoin de conseils pour leur CV. J'aurais aussi aimé trouver une solution technique durable au problème du web scraping pour que l'utilisateur n'ait vraiment qu'un lien à copier-coller.

Je vais sûrement essayer d'y travailler en dehors des cours pour le mettre en ligne afin qu'il soit à 100 % fonctionnel pour tout le monde.

Enfin, un grand merci de nous avoir guidés à travers ce projet.
