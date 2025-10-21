# FORTUNA:LIGA Tracker

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