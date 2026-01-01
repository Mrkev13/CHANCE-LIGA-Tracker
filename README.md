# FORTUNA:LIGA Tracker

Jednoduchá webová aplikace pro zobrazení fotbalových zápasů. Zobrazuje poslední výsledky a zápasy podle kola. Sekce „Živé zápasy“ a banner „Filtrováno: FORTUNA:LIGA“ byly odstraněny.

## Refaktoring 2025-12
- SSOT: Týmy jsou centralizované v `client/src/shared/teams.json` a používány klientem i serverem.
- Backend čte zápasy z `parsed_matches.json` a sjednocuje výpočet tabulky.
- Odebrán hráčský modul a související endpointy (`/players`), odstraněna stránka hráče a odkaz v headeru.
- Exportován výpočet tabulky pro testy z `client/src/redux/slices/tableSlice.ts`.
- Přidány unit testy: `teamLogos.test.ts`, `tableSlice.test.ts`.
- Zachována existující funkcionalita zobrazení zápasů a tabulky.

### Spuštění testů
```
cd client
npm test -- --watchAll=false
```

### Migrace
- Klient: odstraněna route `"/player/:id"` a redukovány odkazy v headeru.
- Server: odstraněny endpoints `/api/players*`. Pokud využíváte externí spotřebu těchto cest, přesměrujte na vlastní zdroj.
- Týmy: používejte `client/src/shared/teams.json` jako jediný zdroj.

## Stack a architektura
- Frontend: React 18, `react-scripts`, `styled-components`, Redux Toolkit
- Backend: Node.js + Express, Socket.IO (připraveno), Axios
- Datový zdroj: Lokální data `client/src/shared/teams.json` a `parsed_matches.json`
- Komunikace: Klient používá lokální dataset; backend poskytuje sjednocené API nad lokálními daty.

## Požadavky
- Node.js 18+ (doporučeno)
- Otevřené porty `3000` (frontend) a `5000` (backend)

## Instalace
V kořeni projektu `d:\PV\TP` spusťte instalaci všech závislostí.

Windows (doporučeno spouštět přes CMD, kvůli blokaci `npm.ps1` v PowerShellu):

```
cmd /c "npm run install:all"
```

macOS/Linux:

```
npm run install:all
```

## Spuštění (vývoj)
Spustí současně backend i frontend.

Windows:
```
cmd /c "npm run dev"
```

macOS/Linux:
```
npm run dev
```

Po spuštění:
- Frontend: `http://localhost:3000/`
- Backend: `http://localhost:5000/`

### Spuštění jednotlivě
- Pouze backend (port `5000`):
  - Windows: `cmd /c "npm run dev:server"`
  - macOS/Linux: `npm run dev:server`
- Pouze frontend (port `3000`):
  - Windows: `cmd /c "npm run dev:client"`
  - macOS/Linux: `npm run dev:client`

### Když je port 3000 obsazen
- Windows:
```
cmd /c "cd client && set PORT=3001 && npm start"
```
- macOS/Linux:
```
cd client && PORT=3001 npm start
```
- Trvalé nastavení portu: vytvořte `client/.env` s obsahem `PORT=3001`.

## Produkce (volitelně)
Vybuilduje frontend a spustí server tak, aby sloužil statický build.

```
npm run build
```

Windows:
```
cmd /c "set NODE_ENV=production && npm start"
```
macOS/Linux:
```
NODE_ENV=production npm start
```

Poté poběží vše na `http://localhost:5000/` (frontend i API).

## Konfigurace API
Soubor `server/config/api.json`:

```
{
  "apiKey": "<Bearer token>",
  "baseUrl": "https://is.test.mobil-api.fotbal.cz/v1",
  "requestLimit": 100,
  "cacheTime": 60
}
```

- Autorizace: `Authorization: Bearer <token>`
- Hlavičky: `Accept: application/json`, `User-Agent: fortuna-liga-tracker/1.0`
- Implementace hlaviček: `server/services/ExternalApiAdapter.js`

## Backend API (lokální)
Základní cesty v `server/api/routes.js`:
- `GET /api/matches` – vrací lokální dataset zápasů
- `GET /api/matches/:id` – detail zápasu z lokálního datasetu
- `GET /api/matches/live` – filtrace lokálních zápasů dle statusu
- `GET /api/table` – výpočet ligové tabulky nad lokálními daty
- `GET /api/competitions` – prázdný seznam (nepoužito)
- `GET /api/teams` – vrací seznam týmů ze SSOT JSON
- `GET /api/teams/:id/matches` – filtrované zápasy týmu

## Klient – aktuální chování
- Zobrazuje: „Zápasy podle kola“ (seskupení dle `round`)
- Zobrazuje: tabulku podle odehraných zápasů
- Prázdné stavy zůstávají zachovány

## CORS / Client URL
Pokud spouštíte frontend na jiném portu než `3000`, nastavte v `server/.env`:

```
CLIENT_URL=http://localhost:3001
```

Server (`server/index.js`) používá `CLIENT_URL` pro CORS nastavení Socket.IO.

## Poznámka k PowerShellu na Windows
Pokud uvidíte chybu „npm.ps1 is not digitally signed…“, používejte spouštění přes CMD:

```
cmd /c "npm run install:all"
cmd /c "npm run dev"
```

## Licence
MIT

Webová aplikace zaměřená na českou fotbalovou ligu FORTUNA:LIGA, poskytující živé výsledky, statistiky, tabulky a další informace.

## Hlavní funkce

- **Živé skóre** - sledování zápasů v reálném čase
- **Ligová tabulka** - aktuální pořadí týmů s detailními statistikami
- **Statistiky hráčů** - individuální výkony a žebříčky
- **Historie zápasů** - kompletní archiv všech odehraných zápasů
- **Notifikační systém** - upozornění na důležité události

## Technologie

### Frontend
- React.js s TypeScript
- Redux pro state management
- Styled Components
- React Router

### Backend
- Node.js s Express.js
- RESTful API + WebSockets
- JWT autentizace
- Redis caching

### Databáze
- PostgreSQL jako hlavní databáze
- Redis pro caching

## Instalace a spuštění

### Požadavky
- Node.js (v14+)
- npm nebo yarn
- PostgreSQL
- Redis

### Instalace
```bash
# Klonování repozitáře
git clone https://github.com/vas-uzivatelske-jmeno/fortuna-liga-tracker.git
cd fortuna-liga-tracker

# Instalace závislostí
npm install

# Konfigurace
cp .env.example .env
# Upravte .env soubor s vašimi údaji a API klíčem
```

### Spuštění vývojového serveru
```bash
# Frontend
npm run dev:client

# Backend
npm run dev:server
```

## Napojení na externí API

Aplikace je připravena pro napojení na externí API s daty o zápasech, týmech a hráčích. Pro konfiguraci API:

1. Získejte API klíč od poskytovatele dat
2. Vložte klíč do konfiguračního souboru `config/api.json`
3. Restartujte server

Aplikace automaticky začne používat data z externího API bez nutnosti dalších úprav.

## Struktura projektu

```
fortuna-liga-tracker/
├── client/                 # Frontend aplikace
│   ├── public/             # Statické soubory
│   └── src/                # Zdrojový kód
│       ├── components/     # React komponenty
│       ├── pages/          # Stránky aplikace
│       ├── redux/          # Redux store a reducery
│       ├── services/       # Služby pro API komunikaci
│       └── styles/         # Globální styly
├── server/                 # Backend aplikace
│   ├── api/                # API endpointy
│   ├── config/             # Konfigurační soubory
│   ├── controllers/        # Kontrolery
│   ├── models/             # Databázové modely
│   ├── services/           # Služby
│   └── utils/              # Pomocné funkce
└── shared/                 # Sdílené typy a konstanty
```

## Licence

MIT
