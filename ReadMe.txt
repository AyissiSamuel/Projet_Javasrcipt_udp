PLATEFORME DE MONITORING (JAVASCRIPT-UDP)
Ce projet consiste à réaliser un mini système IoT de surveillance environnementale permettant de mesurer et consulter à distance des données physiques à l’aide d’une carte Arduino Uno.
L’Arduino est connecté à un capteur de distance HC-SR04 pour la détection d’obstacles ou de mouvements, ainsi qu’à un capteur DHT11 pour la mesure de la température et de l’humidité.
Les données collectées par les capteurs sont transmises à un serveur IoT, qui communique avec un client via le protocole UDP.
Grâce à une plateforme de connexion, le client peut interroger le système et afficher en temps réel les informations renvoyées par les capteurs.

Procédure d’exécution du projet

Pour exécuter correctement la plateforme de monitoring IoT, les étapes suivantes doivent être respectées :
Lancement du serveur
•	Ouvrir l’invite de commande (CMD ou PowerShell).
•	Se placer dans le répertoire du projet contenant le fichier server.js :
cd chemin/vers/le/projet
•	Lancer le serveur avec la commande :
node server.js
Si tout est correct, le serveur démarre et devient accessible sur le port 3000.
________________________________________

Accès à la plateforme
?? En local (même machine)
Dans le navigateur, saisir :
http://localhost:3000/login

?? Sur le réseau local (autre ordinateur ou téléphone)
Dans le navigateur, saisir :
http://192.168.252.67:3000/login
(ou l’adresse IP locale de la machine hébergeant le serveur).
L’appareil client doit être connecté au même réseau Wi-Fi que la machine serveur.
________________________________________

Authentification
Une page de connexion s’affiche.
L’utilisateur doit entrer le mot de passe :
admin123
Ce mot de passe est vérifié côté serveur grâce à :
•	une requête POST
•	un système de hashage avec bcrypt
•	une gestion de sessions (express-session)
Si le mot de passe est correct, l’utilisateur est redirigé vers :
/monitoring
________________________________________

Fonctionnement de la plateforme
Une fois connecté :
•	Le navigateur établit une connexion WebSocket avec le serveur.
•	Le serveur récupère les données envoyées par l’Arduino via le port série (COM3).
•	Les données sont transmises en temps réel au client au format JSON.
•	L’interface affiche :
o	les valeurs numériques (distance, température, humidité),
o	un graphique dynamique (Chart.js),
o	des jauges visuelles,
o	une alerte sonore en cas de distance critique.
________________________________________

?? Résumé du fonctionnement global
Capteurs ? Arduino ? Liaison série ? Serveur Node.js ? WebSocket ? Interface Web ? Affichage temps réel

