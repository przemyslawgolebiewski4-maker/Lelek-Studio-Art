import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "legal.withdrawal"),
    alternates: { canonical: `${SITE_URL}/widerrufsrecht` },
  };
}

export const revalidate = 60;

export default async function WiderrufsrechtPage() {
  const locale = await getLocale();
  if (locale === "pl") {
    return (
      <article>
        <section className="page-shell">
          <h1 className="page-h1">Prawo odstąpienia od umowy</h1>
        </section>
        <div className="page-content">
          <div className="legal-prose">
            <h2>Prawo odstąpienia</h2>
            <p>
              Masz prawo odstąpić od tej umowy w ciągu trzydziestu dni bez podawania przyczyny.
            </p>
            <p>
              Termin odstąpienia wynosi trzydzieści dni od dnia, w którym Ty lub wskazana przez
              Ciebie osoba trzecia, inna niż przewoźnik, weszliście w posiadanie towaru.
            </p>
            <p>
              Aby skorzystać z prawa odstąpienia, musisz poinformować nas (Przemysław
              Gołębiewski, LELEK, Sewanstraße 128, 10319 Berlin, lelekstudio@lelekstudio.com) o
              swojej decyzji w drodze jednoznacznego oświadczenia, na przykład listem wysłanym
              pocztą albo e-mailem.
            </p>
            <p>
              Aby zachować termin, wystarczy wysłać informację o odstąpieniu przed jego upływem.
            </p>
            <h2>Skutki odstąpienia</h2>
            <p>
              Jeśli odstąpisz od tej umowy, zwrócimy wszystkie otrzymane od Ciebie płatności
              niezwłocznie, a najpóźniej w ciągu czternastu dni od dnia, w którym dotarła do nas
              informacja o odstąpieniu. Do zwrotu użyjemy tego samego środka płatności, którego
              użyto w pierwotnej transakcji, chyba że wyraźnie umówiono się inaczej.
            </p>
            <p>
              Możemy wstrzymać zwrot do czasu otrzymania towaru z powrotem albo do czasu
              dostarczenia dowodu jego odesłania, w zależności od tego, co nastąpi wcześniej.
            </p>
            <p>
              Towar należy odesłać niezwłocznie, a w każdym razie nie później niż w ciągu
              czternastu dni. Termin jest zachowany, jeśli wyślesz towar przed upływem tych
              czternastu dni.
            </p>
            <p>Ponosisz bezpośrednie koszty odesłania towaru.</p>
            <p>
              Odpowiadasz za ewentualne zmniejszenie wartości towaru tylko wtedy, gdy wynika ono
              z obchodzenia się z nim w sposób wykraczający poza to, co jest potrzebne do
              stwierdzenia charakteru, cech i sposobu działania towaru.
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">Widerrufsbelehrung</h1>
      </section>

      <div className="page-content">
        <div className="legal-prose">
          <h2>Widerrufsrecht</h2>
          <p>
            Sie haben das Recht, binnen dreißig Tagen ohne Angabe von Gründen diesen
            Vertrag zu widerrufen.
          </p>
          <p>
            Die Widerrufsfrist beträgt dreißig Tage ab dem Tag, an dem Sie oder ein von
            Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz
            genommen haben bzw. hat.
          </p>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Przemysław Gołębiewski,
            LELEK, Sewanstraße 128, 10319 Berlin, lelekstudio@lelekstudio.com) mittels
            einer eindeutigen Erklärung (z.B. per Post versandter Brief oder E-Mail) über
            Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
          </p>
          <p>
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über
            die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
          </p>

          <h2>Folgen des Widerrufs</h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, erstatten wir Ihnen alle Zahlungen, die
            wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn
            Tagen ab dem Tag, an dem die Mitteilung über Ihren Widerruf bei uns
            eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel,
            das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit
            Ihnen wurde ausdrücklich etwas anderes vereinbart.
          </p>
          <p>
            Wir können die Rückzahlung verweigern, bis wir die Waren zurückerhalten haben
            oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt
            haben, je nachdem, welches der frühere Zeitpunkt ist.
          </p>
          <p>
            Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn
            Tagen an uns zurückzusenden. Die Frist ist gewahrt, wenn Sie die Waren vor
            Ablauf der Frist von vierzehn Tagen absenden.
          </p>
          <p>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</p>
          <p>
            Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser
            Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und
            Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen
            ist.
          </p>
        </div>
      </div>
    </article>
  );
}
