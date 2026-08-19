import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: `${SITE_URL}/impressum` },
};

export const revalidate = 60;

export default function ImpressumPage() {
  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">Impressum</h1>
      </section>

      <div className="page-content">
        <div className="legal-prose">
          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            Przemysław Gołębiewski
            <br />
            handelnd unter „LELEK”
            <br />
            Sewanstraße 128
            <br />
            10319 Berlin
            <br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            E-Mail:{" "}
            <a href="mailto:lelekstudio@lelekstudio.com">lelekstudio@lelekstudio.com</a>
            <br />
            Kontaktformular: <Link href="/contact">Kontaktformular</Link>
          </p>

          <h2>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG</h2>
          <p>DE463889135</p>

          <h2>Kleinunternehmerregelung</h2>
          <p>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.</p>

          <h2>Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
            (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            <br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
            <br />
            Wir sind nicht bereit und nicht verpflichtet, an einem
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </div>
      </div>
    </article>
  );
}
