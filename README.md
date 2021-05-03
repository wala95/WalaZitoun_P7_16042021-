# WalaZitoun_P6_16-04-2021
# Projet 7 OpenClassrooms "Créez un réseau social d’entreprise"
C'est mon septième projet dans le cadre de ma formation **Developpeur Web**
Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues.

## Technologies utilisées
HTML5, CSS3, BOOTSTRAP5, JS, Node.js, MySql, Sequelise , Express

## Lancer l'API Backend
- Git clone le repo
- Installer MySQL 
- Créer un *USER* et un *mot de passe* MySQL
- Créer une BDD vierge avec la commande “create database <MySQL_BD_NAME>;”
- Créer et remplir le fichier **.env** en se basant sur **.envexemple**
- Créer et remplir le fichier **config/config.json** en se basant sur **config/config.json.exemple**. Ce fichier est utile uniquement pour la création du schéma MySQL via la CLI Sequelize. La description des tables est les fichiers JS dans le dossier `migrations`.

- Dans le terminal:
    ```bash
    $ cd back_end

    $ npm install

    $ npx sequelize-cli db:migrate # permet de créer autmatiquement le schéma SQL dans la BDD en se bassant sur les coordonnées saisies dans config/config.js

    $ nodemon server
    ```
## Lancer le frontend
Le frontend est fait purement en Javascript (pas de framwork comme Angular ou autre).
Il faut donc le lancer via un petit serveur local :
- cd front_end
- Server les fichiers statiques via par exemple la commande `http-server` (après avoir fait `npm install http-server`) 

## Pour donner le droit ADMIN à un utilisateur 
Il suffit de mettre dans la colonne `Users.isAdmin` la valeur `1`. Ce role permet de supprimer n'importe quelle publication et n'importe quel commentaire.
