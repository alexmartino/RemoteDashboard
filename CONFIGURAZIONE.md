# Configurare le notifiche e la pagina condivisa

Questa guida spiega, passo passo, come preparare:

1. **lo script Google** che fornisce le impostazioni alla pagina (broker + SOS);
2. **BeSMS** per l'invio degli SMS;
3. **come si usa** la pagina (amministratore e familiari).

> Idea di fondo: **i segreti non stanno nella pagina**. La pagina, quando le dai un
> *URL di configurazione*, chiede i dati a uno script Google. Chi ha l'URL con la
> **chiave famiglia** ottiene solo il broker; chi ha l'URL con la **chiave admin**
> sblocca anche le Notifiche SOS.

---

## 1) Script Google — fornitore di configurazione

Serve a dare alla pagina i dati del broker (e, per l'admin, le utenze SOS).

1. Vai su **https://script.google.com** → **Nuovo progetto**.
2. Cancella il contenuto e incolla tutto il file **`config-google-script.gs`**.
3. In alto nel file, **cambia le due chiavi** con valori tuoi, lunghi e casuali:
   - `CHIAVE_FAMIGLIA` → la darai ai familiari;
   - `CHIAVE_ADMIN` → la tieni **solo tu**.
4. Compila i dati del **broker** (`host`, `port`, `user`, `pass`, `prefix`)
   e, nella sezione `sos`, le utenze (vedi punto 2 per BeSMS; `mailUrl` è l'URL
   dell'altro script, quello che manda l'email — vedi punto 1-bis).
5. **Pubblica**: menù **Distribuzione → Nuova distribuzione**
   - Tipo (l'ingranaggio): **App web**
   - **Esegui come:** Me
   - **Chi ha accesso:** **Chiunque**
   - **Distribuisci** → autorizza col tuo account → **copia l'URL** che finisce con `/exec`.
6. Ottieni così due URL da incollare nella pagina:
   - **Familiari:** `…/exec?key=` + la tua `CHIAVE_FAMIGLIA`
   - **Amministratore (tu):** `…/exec?key=` + la tua `CHIAVE_ADMIN`

> Per **revocare** l'accesso a tutti: cambia le chiavi nello script e ri-Distribuisci
> (**Gestisci distribuzioni → Modifica → Nuova versione**). Gli URL vecchi smettono di funzionare.

### 1-bis) Script Google — invio email SOS (separato)

È lo script che la **scheda** chiama per mandare la mail quando scatta l'SOS.
È un progetto Apps Script a parte, con un `doGet` che invia l'email con `GmailApp.sendEmail`
e controlla un suo `?key=`. Il suo URL `…/exec?key=…` va messo in `sos.mailUrl`
dello script del punto 1 (così l'admin lo passa alla scheda dalla pagina).

---

## 2) BeSMS — preparare l'invio SMS

BeSMS usa la piattaforma **apisms** (endpoint `https://secure.apisms.it/http/send_sms`).

1. **Acquista/attiva** un pacchetto SMS (gli SMS hanno un costo: si scala dal credito).
2. **Login e Password**: sono quelli del tuo **account BeSMS** →
   vanno in `smsLogin` e `smsPass`.
3. **id_api** (la "rotta"): nell'area riservata, in home, **clicca sul nome del listino**
   in basso: lì trovi il numero → va in `smsIdApi`.
4. **Mittente** (`smsSender`): un nome di **massimo 11 caratteri** (es. `Mamma`) oppure
   un **numero** con `+` e prefisso (es. `+39333...`). Se usi un nome, di solito va
   **registrato** nell'area BeSMS (*Extra → Gestione Mittenti*).
5. **Numeri destinatari** (`smsNumeri`): formato internazionale **senza +**, separati da
   virgola. Esempio: `393351234567,393401234567`.

> Testo dell'SMS: usa lettere/numeri semplici (niente emoji). Il firmware manda un
> messaggio breve tipo *"SOS: richiesta di aiuto dalla dashboard di casa"*.

**Codici di risposta utili** (li vedi sul monitor seriale della scheda):
- `+01 SMS Queued - ID: …` → inviato ✅
- `-103-Not enough credit` → manca credito
- `-104-Invalid id_api` → `smsIdApi` sbagliato
- `-105-Sender…` → mittente non valido/non registrato
- `-100-Invalid destination` → numero nel formato sbagliato

---

## 3) Usare la pagina

### Amministratore (tu)
1. Apri la pagina, riquadro **🔑 Configurazione**.
2. Incolla l'**URL admin** (`…/exec?key=CHIAVE_ADMIN`) → **Carica configurazione**.
3. Si compila tutto e compare il riquadro **🆘 Notifiche SOS**: verifica i dati e premi
   **"Salva e invia alla scheda"** (le utenze vengono memorizzate nella scheda).
4. Prova con **"Invia SOS (test)"** nel riquadro Allarme.

### Familiari
1. Dai loro **solo** l'URL famiglia (`…/exec?key=CHIAVE_FAMIGLIA`).
2. Aprono la pagina, incollano l'URL in **🔑 Configurazione** → **Carica configurazione**.
3. La pagina si connette da sola. Le Notifiche SOS **restano nascoste**: loro possono
   inviare liste, messaggi, allarmi, sveglie, ma non vedono/toccano le utenze SOS.

> Nota di sicurezza: questo protegge dall'uso normale. Un familiare molto tecnico, avendo
> l'accesso al broker, potrebbe comunque scrivere sul topic di config. Per **impedirlo**
> davvero servono utenti HiveMQ separati con permessi (ACL): utente "famiglia" che può
> scrivere solo su `display/sveglie`, utente "admin" che può scrivere anche su `config`.
