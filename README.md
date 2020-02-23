MEMORY Game
===========

TODO : architecture, principes, pourquoi SPA, pourquoi NodeJS, pourquoi React, pourquoi SQLite, pourquoi Sequelize

TODO : tests unitaires
TODO: front: app title and logo


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
