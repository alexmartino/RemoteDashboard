# DashBoard Mamma — pagina di controllo

Pagina web per comandare un display **e-Paper** (todo, messaggi, allarmi, sveglie)
montato su **ESP32**, tramite **MQTT** su WebSocket sicuro (`wss`).

➡️ **Online:** abilita GitHub Pages e apri l'URL del progetto.

## Come si usa
1. Apri la pagina in **Chrome** (per il Web Bluetooth).
2. In **"Impostazioni broker e token"** inserisci i dati del tuo broker MQTT
   (host, porta `wss`, utente, password, token, prefisso topic) — oppure incollali
   come righe `chiave=valore` e premi **"Applica da testo"**.
   I valori restano salvati nel **browser** (localStorage).
3. Componi e invia: lista cose da fare, messaggi, allarmi, sveglie.

## Note
- **Nessuna credenziale** è inclusa nel codice: le inserisci tu e restano nel tuo
  browser.
- La libreria `mqtt.js` è caricata da CDN (serve connessione internet).
- **Web Bluetooth** (per configurare il WiFi della scheda) richiede **Chrome** e un
  contesto **https** (questa pagina su GitHub Pages va bene).

> Il firmware ESP32 e la documentazione completa stanno in un repository separato (privato).
