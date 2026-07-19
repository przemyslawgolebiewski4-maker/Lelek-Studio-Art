import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  alternates: { canonical: `${SITE_URL}/datenschutz` },
};

export default function DatenschutzPage() {
  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">Datenschutzerklärung</h1>
        <p className="page-intro">Stand: 15.07.2026</p>
      </section>

      <div className="page-content">
        <div className="prose-brutal">
          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            <br />
            <br />
            Przemyslaw Golebiewski
            <br />
            Lelek Studio
            <br />
            Sewanstraße 128
            <br />
            10319 Berlin
            <br />
            Deutschland
            <br />
            E-Mail: lelekstudio@lelekstudio.com
          </p>

          <h2>2. Hosting und Server-Logfiles</h2>
          <p>
            Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Website erhebt der
            Hosting-Provider automatisch technische Zugriffsdaten (sogenannte Server-Logfiles), die
            Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite,
            verwendeter Browser und Betriebssystem, Referrer-URL. Diese Daten sind technisch
            erforderlich, um die Website auszuliefern und die Betriebssicherheit zu gewährleisten
            (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse an einem stabilen und sicheren
            Betrieb der Website).
          </p>
          <p>
            Bilder und Videos auf dieser Website werden über Vercel Blob Storage ausgeliefert.
          </p>

          <h2>3. Kontaktformular</h2>
          <p>
            Wenn Sie das Kontaktformular auf dieser Website nutzen, werden die von Ihnen angegebenen
            Daten (Name, E-Mail-Adresse, Nachrichtentext) zum Zweck der Bearbeitung Ihrer Anfrage
            verarbeitet und gespeichert (Art. 6 Abs. 1 lit. b DSGVO, vorvertragliche Anfrage bzw.
            Vertragsanbahnung). Eine Weitergabe an Dritte erfolgt nicht, außer an technische
            Dienstleister, die zur Übermittlung der Nachricht erforderlich sind. Die Daten werden
            gelöscht, sobald sie für die Bearbeitung Ihrer Anfrage nicht mehr erforderlich sind,
            spätestens nach 12 Monaten, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht.
          </p>

          <h2>4. Cookies und Analyse-Tools</h2>
          <p>
            Diese Website verwendet ausschließlich technisch notwendige Cookies, die für den Betrieb
            der Website erforderlich sind. Es werden keine Analyse-, Marketing- oder
            Tracking-Cookies eingesetzt, und es findet keine Auswertung Ihres Nutzungsverhaltens
            statt.
          </p>

          <h2>5. Verlinkte externe Dienste</h2>
          <p>
            Diese Website verlinkt auf externe Plattformen (Etsy, Instagram). Beim Anklicken dieser
            Links verlassen Sie diese Website. Für die Datenverarbeitung auf diesen externen
            Plattformen sind deren jeweilige Betreiber verantwortlich:
          </p>
          <p>
            - Etsy, Inc. / Etsy Ireland UC - Datenschutzerklärung:{" "}
            <Link href="https://www.etsy.com/legal/privacy/" target="_blank" rel="noopener noreferrer">
              https://www.etsy.com/legal/privacy/
            </Link>
            <br />- Instagram (Meta Platforms Ireland Ltd.) - Datenschutzerklärung:{" "}
            <Link
              href="https://privacycenter.instagram.com/policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://privacycenter.instagram.com/policy/
            </Link>
          </p>
          <p>
            Diese Website selbst bindet keine Inhalte dieser Plattformen aktiv ein (z. B. keine
            eingebetteten Social-Media-Widgets); es handelt sich ausschließlich um einfache
            Textlinks.
          </p>

          <h2>6. Ihre Rechte als betroffene Person</h2>
          <p>Sie haben nach der DSGVO das Recht auf:</p>
          <p>
            - Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)
            <br />- Berichtigung unrichtiger Daten (Art. 16 DSGVO)
            <br />- Löschung Ihrer Daten (Art. 17 DSGVO)
            <br />- Einschränkung der Verarbeitung (Art. 18 DSGVO)
            <br />- Datenübertragbarkeit (Art. 20 DSGVO)
            <br />- Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)
          </p>
          <p>
            Wenden Sie sich dazu formlos an die unter Punkt 1 genannte Kontaktadresse.
          </p>

          <h2>7. Beschwerderecht bei einer Aufsichtsbehörde</h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung
            Ihrer personenbezogenen Daten zu beschweren, z. B. bei:
          </p>
          <p>
            Berliner Beauftragte für Datenschutz und Informationsfreiheit
            <br />
            Friedrichstr. 219
            <br />
            10969 Berlin
            <br />
            E-Mail: mailbox@datenschutz-berlin.de
          </p>

          <h2>8. Keine automatisierte Entscheidungsfindung</h2>
          <p>
            Es findet keine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne
            von Art. 22 DSGVO statt.
          </p>
        </div>
      </div>
    </article>
  );
}
