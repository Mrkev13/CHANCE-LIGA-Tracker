# FORTUNA:LIGA Tracker

Minimalistická webová aplikace pro zobrazení zápasů české ligy a ligové tabulky. Projekt je vyčištěn podle principů DRY, KISS, YAGNI a SSOT.

## Live
- https://chanceliga.netlify.app/

## Architektura
- Frontend: React 18 + TypeScript, Redux Toolkit, Styled Components, React Router
- Backend: Node.js + Express
- Databáze: MongoDB (Mongoose)
- SSOT: `client/src/shared/teams.json` (týmy) + `parsed_matches.json` (zápasy)
- Server: poskytuje API a periodicky scrapuje živé zápasy

## Nové funkce (Backend)
- **Automatické scrapování**: Implementován `node-cron` pro periodické scrapování `LIVE` zápasů z `onlajny.com`.
- **Scraping Engine**: Využívá `axios` a `cheerio` pro extrakci skóre, střelců, karet a střídání.
- **Logování**: Strukturované logy pomocí `winston` (obsahují matchId, HTTP status, trvání).
- **Graceful Shutdown**: Cron job se korektně ukončí při SIGTERM/SIGINT.
- **Mongoose Integration**: Atomický upsert dat do MongoDB.

## API (lokální)
- `GET /api/matches` – seznam zápasů
- `GET /api/matches/:id` – detail zápasu
- `GET /api/matches/live` – živé zápasy
- `GET /api/matches/rounds` – kola seřazená podle posledního odehraného data
- `GET /api/table` – tabulka ligy
- `GET /api/teams` – seznam týmů ze SSOT
- `GET /api/teams/:id/matches` – zápasy vybraného týmu

## Instalace
Požadavky: Node.js 18+

```bash
npm run install:all
```

## Vývojové spuštění
Spustí současně backend a frontend.

```bash
npm run dev
```

## Testy
- **Frontend**: `npm run test:client`
- **Backend**: `npm test`
- **Scraping CLI**: `npm run scrape <url>` (např. `npm run scrape https://www.onlajny.com/match/id/123456`)

## Konvence kódu
- Editorconfig a Prettier udržují jednotné formátování.
- Importy bez přípon v rámci klienta.
- Žádný zakomentovaný kód ani zbytečné debug výpisy.

## Struktura projektu
```
client/
  ... (React aplikace)
server/
  api/           <-- Routování
  config/        <-- Databázové připojení
  controllers/   <-- Logika API
  models/        <-- Mongoose modely
  test/          <-- Testy (Jest, Nock)
  cronJobs.js    <-- Logika plánování (node-cron)
  index.js       <-- Vstupní bod serveru
  scrapeMatch.js <-- Scraping engine (cheerio)
```

## Licence
MIT