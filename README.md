MEMORY Game
===========

Jeu memory, responsive, deployable en Progressive Web App.

Cliquez sur une carte pour la retourner et commencer la partie.

Vous avez gagné lorsque toutes les paires sont retournées.

Vous perdez si le temps est écoulé avant que vous ne puissiez retourner toutes les cartes.

Les 3 meilleurs scores sont affichés lorsque la partie n'est pas en cours.


Architecture / stack technique
------------


Afin de pouvoir déployer l'application comme une application mobile (ce serait sympa de pouvoir jouer sur mobile), le back a été totalement séparé du front, et l'application fonctionne comme une Single Page App, avec un service API pour le back.

- Service memory_front

  Codé en React. Utilise le serveur de développement de webpack en mode développement en local, mais un serveur nginx en production (container docker).


- Service memory_back

  Codé en NodeJS, avec le framework express (simple, léger et rapide pour créer une API). Permettrait aussi de garder un état en mémoire, sans forcément passer par la base de données, si on voulait par exemple déporter la logique de génération aléatoire du plateau de cartes côté back (car actuellement côté front, et permet donc à ce qui le veulent de simuler des faux scores en appelant simplement la route de création de score); à la différence de PHP qui ne tourne que le temps de la requête http.

  Côté base de données, une base de données SQLite est utilisée; de la même manière, c'est simple et rapide à mettre en place, et l'architecture choisie ne nécessite pas de système de gestion de base de données centralisé avec gestion des utilisateurs et droits comme postgres.
  On aurait aussi pu utiliser une base NOSQL comme MongoDB ou InfluxDB, ou même un serveur de cache comme Redis, mais n'aurait pas d'avantage particulier pour l'architecture choisie.


Installation
------------

- Installer docker

- Installer docker-compose

- Cloner le projet

- Dans le répertoire du projet:

```bash
docker-compose build
docker-compose up -d
```

- Lancer le navigateur sur `http://localhost:3000`


Développement
-------------

Pour lancer le jeu en mode développement (local, sans docker):

- S'assurer que les containers docker ne sont pas lancés, sinon lancer `docker-compose stop`

- La première fois, installer les dépendances:
  - Dans `app/back`, lancer `npm install`
  - Dans `app/front`, lancer `npm install`


- Se rendre dans le dossier `app/back` et lancer `npm start`

- Se rendre dans le dossier `app/front` et lancer `npm start`

- Lancer le navigateur sur `http://localhost:3000`


**A noter:** les modifications front sont automatiquement compilées et la page du navigateur rafraichie, mais les modifications back nécessitent de re-lancer `npm start` pour constater les changements.


Configuration
-------------

Le fichier `docker-compose.yml` est un exemple de configuration des containers docker, pour faire tourner les 2 services sur la même machine, pour un environnement local.

Vous pouvez vous en inspirer pour déployer sur votre propre infrastructure.

- Configuration front

  La configuration se fait en ajoutant un fichier `.env` :

  ```
  # app/front/.env
  REACT_APP_API_URL=http://127.0.0.1:3333
  ```

  Changez la valeur par l'URL de votre API, une fois déployée sur votre serveur.


  - Configuration back

  Aucune configuration n'est nécessaire côté back.

Déploiement
-----------

Vous pouvez déployer les services sur le même serveur, ou sur des machines différentes de manière indépendante.

- Web app

Pour une application WEB classique, il vous suffira de faire pointer votre nom de domaine vers le port 3000 de votre serveur. Vous pouvez aussi faire pointer un autre nom de domaine ou sous-domaine vers le port 3333 pour l'API. Il ne vous restera ensuite qu'à configurer le service front et lancer les containers.

- Progressive web app

Suivre le même procédé que pour une web app classique, mais il vous faudra activer le https et le http2, pour le serveur front comme pour l'API. Vous pourrez par exemple mettre en place un reverse proxy Nginx qui vous facilitera la tâche.
