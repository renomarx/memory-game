# Le service principal qui tournera pour ce container sera un serveur Nginx
FROM nginx

# Met à jour les paquets
RUN apt-get update

# Principalement pour du debug
RUN apt-get install -y curl

# Installation de nodejs
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash
RUN apt-get install -y nodejs

# Création du répertoire cible
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installation des dépendances
# On le fait avant le reste, pour ne pas ré-installer les dépendances à chaque modif de code
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install

# On copie le code source
COPY . /usr/src/app

# Génération des fichiers statiques pour la production
RUN npm run build

# Configuration minimale de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN rm -r /usr/share/nginx/html
RUN ln -s /usr/src/app/build /usr/share/nginx/html
