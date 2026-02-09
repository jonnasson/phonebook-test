# Telefonbuch

Telefonbuch-Suchapplikation mit React/MUI-Frontend, Apollo Server/GraphQL-Backend und MongoDB-Datenbank.

## Architektur

| Schicht       | Technologie                                                          |
| ------------- | -------------------------------------------------------------------- |
| Frontend      | React 19, TypeScript, MUI 7, Apollo Client 4, React Hook Form, React Router 7, Vite 7 |
| Backend       | Apollo Server 5 (standalone), TypeScript, GraphQL                    |
| Datenbank     | MongoDB 7                                                            |
| Auth          | JWT + bcrypt                                                         |
| Infrastruktur | Docker Compose (3 Services: client, server, mongo)                   |

## Schnellstart (Docker)

```bash
npm run docker
```

Startet alle drei Services (MongoDB, Server, Client) mit Build. Die Anwendung ist dann unter **http://localhost:3000** erreichbar.

Beim ersten Start werden die Telefonbuch-Daten automatisch in die Datenbank geladen.

Stoppen:

```bash
npm run docker:down
```

## Umgebungsvariablen

`npm run docker` funktioniert ohne weitere Konfiguration — alle Werte sind in `docker/compose-dev.yml` hinterlegt.

Für `docker compose up` direkt:

```bash
cp .env.example .env
```

Für lokale Entwicklung ohne Docker: `server/.env.local` anlegen:

```env
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=telefonbuch-jwt-secret
PORT=4000
```

## Nutzung

1. Registrierung oder als Gast anmelden unter `/login`
2. Suche nach Namen bzw. Telefonnummer im Suchfeld (live, Groß-/Kleinschreibung wird ignoriert)
3. Klick auf einen Eintrag kopiert die Telefonnummer in die Zwischenablage
4. Neue Telefonbuch-Einträge über das Formular nach Klick auf den Plus-Button hinzufügen

## Entwicklung (ohne Docker)

Voraussetzung: MongoDB muss lokal laufen (Standard-Port 27017).

```bash
# Backend (Port 4000)
cd server
npm install
npm run dev

# Frontend (Port 3000, in separatem Terminal)
cd client
npm install
npm run dev
```
