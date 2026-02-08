# Telefonbuch

Telefonbuch-Suchapplikation mit React/MUI-Frontend, Apollo Server/GraphQL-Backend und MongoDB-Datenbank.

## Architektur

| Schicht       | Technologie                                                          |
| ------------- | -------------------------------------------------------------------- |
| Frontend      | React 19, TypeScript, MUI 7, Apollo Client 4, React Router 7, Vite 7 |
| Backend       | Apollo Server 5 (standalone), TypeScript, GraphQL                    |
| Datenbank     | MongoDB 7                                                            |
| Auth          | JWT + bcrypt                                                         |
| Infrastruktur | Docker Compose (3 Services: client, server, mongo)                   |

## Schnellstart (Docker)

```bash
bin/phonebook-test
```

Startet alle drei Services (MongoDB, Server, Client) mit Build. Die Anwendung ist dann unter **http://localhost:3000** erreichbar.

Beim ersten Start werden die Telefonbuch-Daten automatisch in die Datenbank geladen.

Einzelne Services neu bauen:

```bash
bin/phonebook-test rebuild server
```

Alternativ direkt mit Docker Compose:

```bash
docker compose -f docker/compose-dev.yml up --build
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
