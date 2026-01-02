# FORTUNA:LIGA Tracker

Minimalistická webová aplikace pro zobrazení zápasů české ligy a ligové tabulky. Projekt je vyčištěn podle principů DRY, KISS, YAGNI a SSOT.

## Architektura
- Frontend: React 18 + TypeScript, Redux Toolkit, Styled Components, React Router
- Backend: Node.js + Express
- SSOT: `client/src/shared/teams.json` (týmy) + `parsed_matches.json` (zápasy)

## API (lokální)
- `GET /api/matches` – seznam zápasů
- `GET /api/matches/:id` – detail zápasu
- `GET /api/matches/live` – živé zápasy (filtrace lokálních dat)
- `GET /api/table` – tabulka spočtená nad lokálními daty
- `GET /api/teams` – seznam týmů ze SSOT
- `GET /api/teams/:id/matches` – zápasy vybraného týmu

## Instalace
Požadavky: Node.js 18+

```
cmd /c "npm run install:all"
```

## Vývojové spuštění
Spustí současně backend a frontend.

```
cmd /c "npm run dev"
```

Po spuštění:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Build a produkce
```
npm run build
cmd /c "set NODE_ENV=production && npm start"
```

Server v produkci servíruje obsah z `client/build`.

## Testy
Jednotkové testy jsou v klientu:
```
npm test -- --watchAll=false
```

## Konvence kódu
- Editorconfig a Prettier (v kořeni) udržují jednotné formátování.
- Importy bez přípon (`.ts/.tsx`) uvnitř klienta.
- Žádný zakomentovaný kód ani zbytečné debug výpisy.

## Struktura projektu
```
client/
  public/
  src/
    components/
    pages/
    redux/
      slices/
      store.ts
    shared/
    styles/
    utils/
server/
  api/
  controllers/
  index.js
```

## Licence
MIT
