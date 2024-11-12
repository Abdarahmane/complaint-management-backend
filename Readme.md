## API Gestion des Réclamations Clients pour Supermarchés

### Description

API pour gérer les réclamations clients dans les supermarchés, avec des fonctionnalités CRUD pour les réclamations, le suivi des statuts, l'assignation aux employés, et l'authentification utilisateur. Développée avec Node.js, Prisma, Express.js et PostgreSQL.
Prérequis

    Node.js (14+)
    PostgreSQL
    npm

### Technologies Utilisées
```
    Node.js : Serveur
    Express : Framework web
    PostgreSQL : Base de données
    Postman : Tests API

```

Installation
    Clonez le dépôt :

```

 git clone https://github.com/Abdarahmane/complaint-management-backend.git

```

Accédez au répertoire du projet :
```

cd complaint-management-backend 
````
Installez les dépendances :

    npm install

### Utilisation

Démarrez l'application :

```
npm start
```
Configuration de la Base de Données

Configurez PostgreSQL avec une base gestion_reclamations. Renommez .env.example en .env et ajoutez vos identifiants de connexion.


### Endpoints de l'API

Importez la collection Postman dans la racine du projet pour tester les endpoints.
Exemples d'Endpoints

    GET /complaint : Récupère toutes les réclamations.
    POST /complaint : Crée une nouvelle réclamation.
    PUT /complaint/
    : Met à jour une réclamation.

## Auteur
 [ABDARAHMANE IBRAHIMA DEMBA](https://github.com/Abdarahmane)
