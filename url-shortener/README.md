# URL Shortener — Documentation du projet

Ce dépôt contient une petite API de raccourcisseur d'URL prévue pour être déployée en tant que fonctions Lambda (SAM). Le code se trouve dans le dossier `lambda/src` et contient deux handlers principaux :

- `shorten.mjs` : création d'une URL raccourcie
- `redirect.mjs` : redirection depuis la clé courte vers l'URL longue

**Important — état actuel :**
La logique de persistance (DynamoDB) n'est pas implémentée car le TP a été réalisé sur Linux. 
J'ai émis l'hypothèse que dynamoDb fonctionnait mal sur cet OS, car j'ai essayé de faire fonctionner le projet finis d'un collègue qui m'a indiqué la meme erreur que sur mon projet non finalisé.
J'ai donc décidé de faire une petite partie du TP, avec une simulation légère du comportement de dynamoDB. 
Je m'en suis rendue compte le 06/02 (sinon c'est pas drole :D) après avoir passé plusieurs (beaucoup) d'heures à essayer de comprendre le soucis, donc je ne penses pas que je finirais le travail demandé.

### Contrat des handlers (format attendu)

**Input (Request)** :

- **Méthode** : POST
- **Path** : `/shorten`
- **Body** (JSON) :

    ```json
    {
      "url": "https://www.example.com/very/long/url/path"
    }
    ```

- **Headers** : `Content-Type: application/json`

**Input (Request)** :

- **Méthode** : GET
- **Path** : `/{shortKey}`
- **Path Parameters** : `shortKey` (String)
- **Exemple** : `GET /aB3dEf`

### Installation et exécution locale (Linux)

1) Installer les dépendances (si nécessaire)

Ouvrez un terminal dans `lambda/` et lancez :

```sh
cd /chemin/vers/url-shortener/lambda
npm install
```

2) Lancer les docker

```sh
cd ../
docker composes up -d
```

3) Lancer SAM localement

```sh
sam local start-api --template template.yaml
```

Vous pouvez maintenant accéder à l'API sur `http://localhost:3000`.
