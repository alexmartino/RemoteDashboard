/**
 * DashBoard Mamma — FORNITORE DI CONFIGURAZIONE
 * ------------------------------------------------------------------
 * Restituisce in JSON i dati del broker MQTT (per i familiari) e, SOLO con
 * la chiave amministratore, anche le utenze delle Notifiche SOS (email/SMS)
 * più il flag admin:true che nella pagina sblocca il riquadro "Notifiche SOS".
 *
 * Il familiare incolla nella pagina l'URL ...exec?key=CHIAVE_FAMIGLIA
 * L'amministratore usa    ...exec?key=CHIAVE_ADMIN
 *
 * NON è lo stesso script che manda l'email dell'SOS: quello resta separato,
 * e il suo URL va messo qui sotto in  sos.mailUrl.
 *
 * PUBBLICAZIONE (una volta):
 *   Distribuzione → Nuova distribuzione → Tipo: "App web"
 *   Esegui come: Me    |    Chi ha accesso: Chiunque
 *   Copia l'URL che finisce con /exec.
 * ------------------------------------------------------------------
 */

// 🔑 CAMBIA queste due chiavi con valori TUOI, lunghi e casuali:
var CHIAVE_FAMIGLIA = 'fam-CAMBIAMI-metti-qualcosa-di-lungo';  // la dai ai familiari
var CHIAVE_ADMIN    = 'adm-CAMBIAMI-tienila-solo-tu';          // la tieni tu (admin)

function doGet(e) {
  var key = (e && e.parameter && e.parameter.key) ? e.parameter.key : '';

  // ---- Dati del broker MQTT (uguali per tutti) ----
  var broker = {
    host:   'xxxx.s1.eu.hivemq.cloud',   // host del tuo broker HiveMQ
    port:   '8884',                      // porta WebSocket sicura (wss)
    user:   'utente-broker',
    pass:   'password-broker',
    prefix: 'casa/anziano'
  };

  // ---- Utenze Notifiche SOS (SOLO amministratore) ----
  var sos = {
    mailUrl:   'https://script.google.com/macros/s/XXXX/exec?key=CHIAVE_EMAIL', // lo script dell'EMAIL SOS
    smsLogin:  'utente-besms',
    smsPass:   'password-besms',
    smsSender: 'Mamma',                  // mittente: max 11 caratteri, oppure un numero con +
    smsIdApi:  '5',                      // id_api (rotta) del listino BeSMS
    smsNumeri: '393351234567,393401234567' // numeri separati da virgola, formato 39... senza +
  };

  var out;
  if (key === CHIAVE_ADMIN) {
    out = broker;
    out.admin = true;                    // sblocca il riquadro Notifiche SOS nella pagina
    out.sos = sos;
  } else if (key === CHIAVE_FAMIGLIA) {
    out = broker;                        // solo broker, niente utenze SOS
  } else {
    out = { errore: 'chiave non valida' };
  }

  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
