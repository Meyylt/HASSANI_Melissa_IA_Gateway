Prompt : Lancement du serveur avec import fitz (PyMuPDF).
L'erreur : ImportError: DLL load failed while importing _extra: Le module spécifié est introuvable.
La solution : C'était le plus gros blocage technique. La bibliothèque PyMuPDF nécessite des composants système C++ (DLL) souvent absents sur un PC neuf. Plutôt que de surcharger mon système avec des installations complexes, j'ai décidé de pivoter techniquement : j'ai remplacé PyMuPDF par pdfplumber.
Résultat : pdfplumber étant plus léger et mieux supporté sur mon environnement actuel, le serveur a pu démarrer instantanément. Cela montre l'importance de savoir adapter sa stack technique aux contraintes matérielles.
