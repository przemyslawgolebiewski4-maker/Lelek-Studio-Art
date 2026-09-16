/** Default legal copy — used when Settings fields are empty (Datenschutz).
 *  Impressum and Widerrufsbelehrung pages render structured JSX from these
 *  constants so the drafted wording cannot be silently overridden by stale CMS text.
 */

export const DEFAULT_IMPRESSUM = `Angaben gemäß § 5 DDG

Przemysław Gołębiewski
handelnd unter „LELEK"
Sewanstraße 128
10319 Berlin
Deutschland

Kontakt
E-Mail: lelekstudio@lelekstudio.com
Kontaktformular: /contact

Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG
DE463889135

Kleinunternehmerregelung
Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.

Streitschlichtung
Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/
Unsere E-Mail-Adresse finden Sie oben im Impressum.
Wir sind nicht bereit und nicht verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.`;

export const DEFAULT_WIDERRUFSBELEHRUNG = `Widerrufsrecht
Sie haben das Recht, binnen dreißig Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

Die Widerrufsfrist beträgt dreißig Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Przemysław Gołębiewski, LELEK, Sewanstraße 128, 10319 Berlin, lelekstudio@lelekstudio.com) mittels einer eindeutigen Erklärung (z.B. per Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.

Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.

Folgen des Widerrufs
Wenn Sie diesen Vertrag widerrufen, erstatten wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.

Wir können die Rückzahlung verweigern, bis wir die Waren zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.

Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen an uns zurückzusenden. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.

Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.

Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.`;

export const DEFAULT_DATENSCHUTZ = `## 1. Verantwortlicher

Verantwortlich für die Datenverarbeitung auf dieser Website ist:

Przemyslaw Golebiewski
Lelek Studio
Sewanstraße 128
10319 Berlin
Deutschland
E-Mail: lelekstudio@lelekstudio.com

## 2. Hosting und Server-Logfiles

Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Website erhebt der Hosting-Provider automatisch technische Zugriffsdaten (sogenannte Server-Logfiles), die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite, verwendeter Browser und Betriebssystem, Referrer-URL. Diese Daten sind technisch erforderlich, um die Website auszuliefern und die Betriebssicherheit zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse an einem stabilen und sicheren Betrieb der Website).

Bilder und Videos auf dieser Website werden über Vercel Blob Storage ausgeliefert.

## 3. Kontaktformular

Wenn Sie das Kontaktformular auf dieser Website nutzen, werden die von Ihnen angegebenen Daten (Name, E-Mail-Adresse, Nachrichtentext) zum Zweck der Bearbeitung Ihrer Anfrage verarbeitet und gespeichert (Art. 6 Abs. 1 lit. b DSGVO, vorvertragliche Anfrage bzw. Vertragsanbahnung). Eine Weitergabe an Dritte erfolgt nicht, außer an technische Dienstleister, die zur Übermittlung der Nachricht erforderlich sind. Die Daten werden gelöscht, sobald sie für die Bearbeitung Ihrer Anfrage nicht mehr erforderlich sind, spätestens nach 12 Monaten, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht.

## 4. Cookies und Analyse-Tools

Technisch notwendige Speicherung (Ihre Cookie-Entscheidung) erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.

Wenn Sie zustimmen (Art. 6 Abs. 1 lit. a DSGVO), setzen wir den Google-Tag (GT-NML4M7CV) für Google Analytics und optionales Marketing. Die Messung ist mit dem Shop unter shop.lelekstudio.com verknüpft (Cross-Domain). Ohne Einwilligung bleiben Analytics- und Marketing-Cookies deaktiviert (Google Consent Mode). Die Einwilligung können Sie jederzeit über „Cookie preferences“ im Footer widerrufen.

Zusätzlich nutzen wir Vercel Analytics. Dieser Dienst ist first-party und setzt keine Werbecookies.

## 5. Verlinkte externe Dienste

Diese Website verlinkt auf externe Plattformen (Instagram, Shop). Beim Anklicken dieser Links verlassen Sie diese Website. Für die Datenverarbeitung auf diesen externen Plattformen sind deren jeweilige Betreiber verantwortlich. Der Shop (shop.lelekstudio.com) verwendet eigene Cookie-Einstellungen von Shopify.

## 6. Ihre Rechte als betroffene Person

Sie haben nach der DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an die oben genannte E-Mail-Adresse.

Stand: 16.09.2026`;

/** Defaults for /contact when Settings fields are empty. */
export const CONTACT_DEFAULTS = {
  heading1: "Connect",
  heading2: "with",
  heading3: "the clay.",
  sub: "Wall objects, custom orders, interior projects - or simply to say something. I work intuitively. I will respond the same way.",
  success: "Message sent. Thank you - we will reply soon.",
  formNote: "lelekstudio@lelekstudio.com\nClay Stories Berlin",
} as const;
