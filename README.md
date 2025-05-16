# GEOBet Analyzer

## Integrazione con Google Places API

Questo progetto utilizza le API di Google Places per cercare luoghi sensibili nelle vicinanze di un indirizzo specificato.

### Configurazione della chiave API di Google Maps

Per utilizzare le API di Google Places, è necessario ottenere una chiave API di Google Maps. Segui questi passaggi:

1. Vai alla [Console Google Cloud](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona un progetto esistente
3. Vai a "API e servizi" > "Credenziali"
4. Clicca su "Crea credenziali" > "Chiave API"
5. Copia la chiave API generata
6. Apri il file `src/config/apiKeys.ts` e sostituisci `YOUR_GOOGLE_MAPS_API_KEY` con la tua chiave API

### Abilitazione delle API necessarie

Dopo aver creato la chiave API, devi abilitare le seguenti API nel tuo progetto Google Cloud:

1. Maps JavaScript API
2. Places API
3. Geocoding API

Per abilitare queste API:

1. Vai a "API e servizi" > "Libreria"
2. Cerca e seleziona ciascuna API dall'elenco
3. Clicca su "Abilita"

### Restrizioni della chiave API (consigliato)

Per motivi di sicurezza, è consigliabile limitare l'uso della tua chiave API:

1. Vai a "API e servizi" > "Credenziali"
2. Trova la tua chiave API e clicca su "Modifica"
3. Aggiungi restrizioni per dominio (HTTP referrer) specificando i domini su cui verrà utilizzata l'applicazione
4. Limita l'uso della chiave solo alle API necessarie (Maps JavaScript API, Places API, Geocoding API)

## Esecuzione dell'applicazione

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

## Funzionalità

- Ricerca di luoghi sensibili (scuole, chiese, ospedali, ecc.) nelle vicinanze di un indirizzo
- Visualizzazione dei luoghi su una mappa interattiva
- Filtro dei luoghi per categoria
- Calcolo delle distanze tra l'indirizzo cercato e i luoghi sensibili
- Identificazione delle sale scommesse nelle vicinanze