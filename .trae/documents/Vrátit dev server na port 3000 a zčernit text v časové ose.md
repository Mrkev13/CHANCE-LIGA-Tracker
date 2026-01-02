## Cíl
- Vrátit klientský dev server na `http://localhost:3000`.
- Nastavit, aby text v bloku časové osy (vybraný `div`) byl černý.

## Změny (implementace)
- Port 3000:
  - Ukončit běžící dev server spuštěný s `PORT=3001` a spustit klient bez nastavování proměnné `PORT`, což v CRA implicitně použije `3000`.
  - Volitelně přidat soubor `client/.env` s řádkem `PORT=3000` pro explicitní a trvalé nastavení portu.
- Barva textu v časové ose:
  - Upravit styled-component `TimelineSection` v `client/src/pages/MatchDetailPage.tsx:158` a přidat `color: #000;`, aby veškerý standardní text uvnitř časové osy byl černý.
  - Hlavička poločasů (`HalfHeader` v `client/src/pages/MatchDetailPage.tsx:169`) a čas události (`EventTime` v `client/src/pages/MatchDetailPage.tsx:213`) mají vlastní barvy; zůstanou beze změny.

## Ověření
- Spustit klient na `http://localhost:3000` a otevřít stránku detailu zápasu.
- Zkontrolovat, že:
  - Dev server běží na portu `3000`.
  - Texty v časové ose (hráči, asistence, poznámky) se zobrazují černě uvnitř bílého bloku.

## Poznámky
- CRA respektuje port z proměnné prostředí `PORT`; bez jejího nastavení se použije `3000`.
- Zásah do `TimelineSection` je lokální pro časovou osu a nemá dopad na ostatní části UI.