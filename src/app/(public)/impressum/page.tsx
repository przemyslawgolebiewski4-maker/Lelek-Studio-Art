import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: `${SITE_URL}/impressum` },
};

export default function ImpressumPage() {
  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">Impressum</h1>
      </section>

      <div className="page-content">
        <div className="prose-brutal">
          <p>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</p>

          <p>
            Przemyslaw Golebiewski
            <br />
            Lelek Studio
            <br />
            Sewanstraße 128
            <br />
            10319 Berlin
            <br />
            Deutschland
          </p>

          <p>
            Kontakt:
            <br />
            E-Mail: lelekstudio@lelekstudio.com
            <br />
            Telefon: +49 155 10227825
          </p>

          <p>
            Umsatzsteuer-Identifikationsnummer:
            <br />
            wird derzeit beim Bundeszentralamt für Steuern beantragt (Stand: 15.07.2026)
          </p>

          <p>
            Hinweis gemäß § 19 UStG:
            <br />
            Als Kleinunternehmer im Sinne des § 19 UStG wird auf Rechnungen keine Umsatzsteuer
            ausgewiesen.
          </p>

          <p>
            Verantwortlich für den Inhalt nach § 18 Abs. 2 Medienstaatsvertrag (MStV):
            <br />
            Przemyslaw Golebiewski, Anschrift wie oben
          </p>

          <p>
            EU-Streitschlichtung:
            <br />
            Die Europäische Kommission stellte vormals eine Plattform zur Online-Streitbeilegung
            (OS) bereit; diese wurde zum 20. Juli 2025 eingestellt. Wir sind nicht verpflichtet und
            nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>

          <p>
            Haftung für Inhalte:
            <br />
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>

          <p>
            Haftung für Links:
            <br />
            Unser Angebot enthält Links zu externen Websites Dritter (u. a. Etsy, Instagram), auf
            deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets
            der jeweilige Anbieter verantwortlich.
          </p>

          <p>
            Urheberrecht:
            <br />
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten (Texte,
            Fotografien der Keramikarbeiten) unterliegen dem deutschen Urheberrecht.
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
            bzw. Erstellers.
          </p>

          <p>Stand: 15.07.2026</p>
        </div>
      </div>
    </article>
  );
}
