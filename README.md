# FORTUNA:LIGA Tracker

Minimalistická webová aplikace pro zobrazení zápasů české ligy a ligové tabulky. Projekt je vyčištěn podle principů DRY, KISS, YAGNI a SSOT.

## Live
- https://chanceliga.netlify.app/

## Architektura
- Frontend: React 18 + TypeScript, Redux Toolkit, Styled Components, React Router
- Backend: Node.js + Express
- SSOT: `client/src/shared/teams.json` (týmy) + `parsed_matches.json` (zápasy)
- Klient: aktuálně využívá lokální dataset v `client/src/redux/slices/matchesSlice.ts` (rozšířené události a naplánovaná kola)
- Server: poskytuje API nad `parsed_matches.json`

## API (lokální)
- `GET /api/matches` – seznam zápasů
- `GET /api/matches/:id` – detail zápasu
- `GET /api/matches/live` – živé zápasy (filtrace lokálních dat)
- `GET /api/matches/rounds` – kola seřazená podle posledního odehraného data
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

## Funkce
- Řazení kol: nejnověji odehrané kolo vždy nahoře; neodehraná kola drží své pořadí a po odehrání se automaticky přesunou nahoru (implementace na klientu i serveru).
- Detail zápasu: události zahrnují góly, žluté/červené karty, střídání s uvedením odcházejícího hráče, neuznané góly a neproměněné penalty.
- Filtrování týmů: výběr pomocí rozbalovacího seznamu se jménem a logem týmu, výběr se ukládá do relace.
- UX: zachování pozice scrollu při návratu ze detailu; perzistence zvoleného kola i týmu v relaci.
- Tabulka: form zobrazuje posledních 5 zápasů s nejnovějším vlevo.

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
