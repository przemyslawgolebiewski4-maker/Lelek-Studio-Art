export type ReserveLang = "en" | "de";

export const RESERVE_LANGS: ReserveLang[] = ["en", "de"];

type ReserveCopy = {
  payCta: string;
  payIcons: string;
  displayThrough: (date: string) => string;
  displayThroughFallback: string;
  keepConfirmation: string;
  wantToday: string;
  morePopupsBefore: string;
  morePopupsAfter: string;
  legalBefore: string;
  returnPolicy: string;
  legalAnd: string;
  impressum: string;
  displayOnlyHere: string;
  reservedExclusive: string;
  stampReserved: string;
  stampSold: string;
  unavailableTitle: string;
  unavailableCopy: string;
  seeCollection: string;
  notFoundEyebrow: string;
  notFoundTitle: string;
  notFoundCopy: (code: string) => string;
  goHome: string;
  langLabel: string;
};

export const RESERVE_COPY: Record<ReserveLang, ReserveCopy> = {
  en: {
    payCta: "Reserve and pay now",
    payIcons: "Card · Apple Pay · Google Pay",
    displayThrough: (date) => `This piece will be on display here through ${date}.`,
    displayThroughFallback: "the end of this exhibition",
    keepConfirmation:
      "Please keep your payment confirmation - you'll need it to collect.",
    wantToday:
      "Want it today instead? Just show your payment confirmation to a member of staff and they can hand it over right away.",
    morePopupsBefore: "More pop-ups coming - follow ",
    morePopupsAfter:
      " on Instagram to see where this collection shows up next.",
    legalBefore: "By paying you agree to our ",
    returnPolicy: "Return Policy",
    legalAnd: " and ",
    impressum: "Impressum",
    displayOnlyHere: "This piece is on display only here.",
    reservedExclusive:
      "Once you scan and pay for this QR code, the piece is reserved exclusively for you - no one else can buy it.",
    stampReserved: "Reserved",
    stampSold: "Sold",
    unavailableTitle: "This piece is no longer available",
    unavailableCopy:
      "Someone was faster. If you'd like something similar, or want to know when the next piece arrives - get in touch.",
    seeCollection: "See the full collection → lelekstudio.com",
    notFoundEyebrow: "Reserve",
    notFoundTitle: "We couldn't find this piece",
    notFoundCopy: (code) =>
      code
        ? `It may no longer be part of an active exhibition, or the code “${code}” is incorrect.`
        : "It may no longer be part of an active exhibition.",
    goHome: "Go to lelekstudio.com",
    langLabel: "Language",
  },
  de: {
    payCta: "Jetzt reservieren und bezahlen",
    payIcons: "Karte · Apple Pay · Google Pay",
    displayThrough: (date) =>
      `Dieses Stück wird hier bis ${date} ausgestellt.`,
    displayThroughFallback: "zum Ende dieser Ausstellung",
    keepConfirmation:
      "Bitte behalte deine Zahlungsbestätigung - du brauchst sie zur Abholung.",
    wantToday:
      "Möchtest du es heute mitnehmen? Zeige einfach deine Zahlungsbestätigung einem Mitarbeiter - dann kann er es dir sofort aushändigen.",
    morePopupsBefore: "Weitere Pop-ups folgen - folge ",
    morePopupsAfter:
      " auf Instagram, um zu sehen, wo diese Kollektion als Nächstes erscheint.",
    legalBefore: "Mit der Zahlung akzeptierst du unsere ",
    returnPolicy: "Widerrufsbelehrung",
    legalAnd: " und das ",
    impressum: "Impressum",
    displayOnlyHere: "Dieses Stück ist nur hier ausgestellt.",
    reservedExclusive:
      "Sobald du diesen QR-Code scannst und bezahlst, ist das Stück ausschließlich für dich reserviert - niemand anderes kann es kaufen.",
    stampReserved: "Reserviert",
    stampSold: "Verkauft",
    unavailableTitle: "Dieses Stück ist nicht mehr verfügbar",
    unavailableCopy:
      "Jemand war schneller. Wenn du etwas Ähnliches möchtest oder wissen willst, wann das nächste Stück kommt - melde dich.",
    seeCollection: "Zur gesamten Kollektion → lelekstudio.com",
    notFoundEyebrow: "Reservierung",
    notFoundTitle: "Wir konnten dieses Stück nicht finden",
    notFoundCopy: (code) =>
      code
        ? `Es ist möglicherweise nicht mehr Teil einer laufenden Ausstellung, oder der Code „${code}“ ist falsch.`
        : "Es ist möglicherweise nicht mehr Teil einer laufenden Ausstellung.",
    goHome: "Zu lelekstudio.com",
    langLabel: "Sprache",
  },
};

export function formatReserveDate(iso: string, lang: ReserveLang) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
