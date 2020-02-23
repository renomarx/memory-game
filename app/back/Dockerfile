# Le service principal du container sera un service Node.
# Alpine est une distribution très légère et sécurisée
FROM node:13-alpine

# Création du répertoire qui va contenir le code source
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installation des dépendances
# On le fait avant le reste, pour ne pas ré-installer les dépendances à chaque modif de code
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install

# On copie le code source
COPY . /usr/src/app

# On lance le serveur node
CMD ["npm", "start"]
