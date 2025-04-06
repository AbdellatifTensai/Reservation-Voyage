# TrainEase - Système de Réservation de Billets de Train

TrainEase est un système moderne de réservation de billets de train, conçu avec une architecture MVC robuste, offrant une expérience de réservation intuitive et engageante pour les utilisateurs et les administrateurs.

## Fonctionnalités

- **Authentification des Utilisateurs :** Système sécurisé de connexion et d’inscription  
- **Contrôle d’Accès Basé sur les Rôles :** Interfaces séparées pour les utilisateurs et les administrateurs  
- **Gestion des Trains et Itinéraires :** Outils d’administration pour gérer les itinéraires et horaires des trains  
- **Gestion des Utilisateurs :** Outils d’administration pour gérer les comptes utilisateurs  
- **Système de Réservation :** Interface conviviale pour rechercher et réserver des billets de train  
- **Gestion des Billets :** Afficher, modifier et annuler des réservations  
- **Design Responsive :** Compatible avec les appareils mobiles, tablettes et ordinateurs  

## Architecture du Système

Le système suit le modèle architectural Modèle-Vue-Contrôleur (MVC) :

- **Frontend :** React.js avec les composants Shadcn UI et Tailwind CSS  
- **Backend Java :** Implémentation en Java 17, Hibernate et Jakarta Persistence  

## Structure du Projet



  ├── frontend/ # Application frontend React
  │   ├── src/
  │   ├── components/ # Composants UI
  │   ├── hooks/ # Hooks React personnalisés
  │   ├── lib/ # Fonctions utilitaires
  │   ├── pages/ # Composants de pages
  │   └── ...
  │ 
  ├── src/main/java/com/trainease/
  │   ├── controller/ # Contrôleurs REST
  │   ├── entity/ # Entités JPA
  │   ├── service/ # Logique métier
  │   └── ...
  │   
  └── uml-diagrams/ # Documentation UML
      ├── use-case-diagram.txt # Interactions utilisateur avec le système
      ├── class-diagram.txt # Structure et relations du système
      ├── frontend-component-diagram.txt # Architecture des composants React
      ├── sequence-diagram.txt # Flux de réservation utilisateur
      ├── admin-sequence-diagram.txt # Flux de travail administrateur
      └── README.md # Documentation des diagrammes

## Documentation

Le système est entièrement documenté à l’aide de diagrammes UML situés dans le répertoire `uml-diagrams` :

1. **Diagramme de Cas d’Utilisation** - Illustre les interactions entre les utilisateurs/administrateurs et le système  
2. **Diagramme de Classes** - Documente la structure des classes du backend et leurs relations  
3. **Diagramme des Composants Frontend** - Cartographie l’architecture des composants React  
4. **Diagrammes de Séquence** - Décrivent le flux des interactions pour les opérations clés comme la réservation ou la gestion admin  

Ces diagrammes offrent une vue d’ensemble complète de l’architecture du système et peuvent être visualisés avec tout outil compatible PlantUML.

## Démarrage

```
cd frontend
npm install
npm run build

cd java-backend
mvn clean install
mvn clean package
java -jar target/train-ease-backend.jar
```

## Configuration de la Base de Données

La base de données comprend les tables suivantes : utilisateurs, trains, itinéraires et réservations.