/**
 * Exact English source → Polish. Keys must match public copy character for character.
 * Polish values do not use em dashes or en dashes.
 */
const PAIRS: ReadonlyArray<readonly [string, string]> = [
  [
    "Przemysław Gołębiewski is a self-taught ceramist, working by intuition rather than plan. The process comes first, always - the hand moves, the mind follows after.",
    "Przemysław Gołębiewski jest ceramikiem samoukiem. Pracuje intuicją, nie planem. Najpierw jest proces, zawsze. Ręka idzie przodem, umysł podąża za nią.",
  ],
  [
    "Przemysław Gołębiewski is a self-taught ceramist in Berlin. Working by intuition rather than plan, he shapes vessels, cups and lamps by hand - never exactly the same.",
    "Przemysław Gołębiewski jest ceramikiem samoukiem w Berlinie. Pracuje intuicją, nie planem i kształtuje ręcznie naczynia, kubki oraz lampy. Żadne nie jest identyczne.",
  ],
  ["The process comes first, always", "Najpierw jest proces, zawsze"],
  ["The process comes first.", "Najpierw jest proces."],
  [
    "Vessels, cups, lamps - organic and raw, shaped by hand, never exactly.",
    "Naczynia, kubki i lampy, organiczne i surowe, kształtowane ręcznie, nigdy identycznie.",
  ],
  ["LELEK - Berlin.", "LELEK - Berlin."],
  ["The hand moves, the mind follows after.", "Ręka idzie przodem, umysł podąża za nią."],
  [
    "Handmade ceramics by ceramist Przemysław Gołębiewski - Lelek Studio Berlin",
    "Ręczna ceramika Przemysława Gołębiewskiego, Lelek Studio Berlin",
  ],
  [
    "Ceramics by Przemysław Gołębiewski - Lelek Studio Berlin. Organic and raw forms shaped by hand, never by mold.",
    "Ceramika Przemysława Gołębiewskiego, Lelek Studio Berlin. Formy organiczne i surowe, kształtowane ręcznie, nigdy z formy.",
  ],
  [
    "LELEK is the ceramic practice of Przemysław Gołębiewski. Organic and brutalist forms, shaped by hand - vessels, cups, lamps and objects that never repeat exactly.",
    "LELEK to ceramiczna praktyka Przemysława Gołębiewskiego. Formy organiczne i brutalistyczne, kształtowane ręcznie: naczynia, kubki, lampy i obiekty, które nigdy nie powtarzają się identycznie.",
  ],
  [
    "Stoneware shaped by hand, not by mold - organic and raw, shown below in the studio's four elements: earth, water, fire, air.",
    "Kamionka kształtowana ręcznie, nie z formy. Organiczna i surowa, pokazana niżej w czterech żywiołach pracowni: ziemia, woda, ogień, powietrze.",
  ],
  [
    "This poster reproduces a photograph of an original ceramic piece, hand-shaped by Przemysław Gołębiewski - not an illustration.",
    "Ten plakat odtwarza fotografię oryginalnej ceramiki, ukształtowanej ręcznie przez Przemysława Gołębiewskiego, a nie ilustrację.",
  ],
  ["Przemysław Gołębiewski - ceramist", "Przemysław Gołębiewski, ceramik"],
  [
    "Ceramic objects by Przemysław Gołębiewski for interiors - organic and raw forms, placed as they are, never to a fixed specification.",
    "Ceramiczne obiekty Przemysława Gołębiewskiego do wnętrz. Formy organiczne i surowe, stawiane takie, jakie są, nigdy według sztywnej specyfikacji.",
  ],
  [
    "I want to bring warmth and something of nature into the home through what I make - I'm drawn to organic shapes, the play of texture, and the feel of a piece under my hands as it takes form. What fascinates me most is how concrete and nature sometimes meet without asking permission - how an organic shape, a natural color, can sit inside something as raw as brutalism and somehow belong there. My own work moves between those two registers: some pieces stay raw, closer to brutalism itself; others lean fully organic. And sometimes the two don't sit side by side at all - they mix into something that only makes sense with itself.",
    "Chcę wnosić do domu ciepło i coś z natury przez to, co robię. Ciągnie mnie do organicznych kształtów, gry faktury i tego, jak rzecz układa się pod dłońmi, kiedy nabiera formy. Najbardziej fascynuje mnie to, że beton i natura czasem spotykają się bez pytania o zgodę. Organiczny kształt i naturalny kolor potrafią usiąść w czymś tak surowym jak brutalizm i jednak tam pasować. Moja praca porusza się między tymi dwoma rejestrami. Niektóre rzeczy zostają surowe, bliżej samego brutalizmu. Inne idą w pełni w stronę organiczności. A czasem te dwa światy wcale nie stoją obok siebie. Mieszają się w coś, co ma sens tylko samo ze sobą.",
  ],
  [
    "Materials with real, unrepeatable origins interest me most: a pigment found on a trip, a clay mix that may never come back the same way twice. The process leaves its own marks - a crack stabilized, not hidden; a drip left where water carried it. What the kiln and the material decide together, not just the maker alone. Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences, shaped by hand, not by mold.",
    "Najbardziej interesują mnie materiały o prawdziwym, niepowtarzalnym pochodzeniu: pigment znaleziony w podróży, mieszanka gliny, która może już nigdy nie wrócić taka sama. Proces zostawia własne ślady. Pęknięcie zostaje ustabilizowane, nie ukryte. Zaciek zostaje tam, gdzie poniosła go woda. O tym decydują razem piec i materiał, nie sam twórca. Niektóre formy wracają, naczynia, kubki, lampy, ale nigdy identycznie. Każda niesie własne, drobne różnice, kształtowane ręcznie, nie z formy.",
  ],
  ["The ceramist", "Ceramik"],
  ["Who is Przemysław Gołębiewski?", "Kim jest Przemysław Gołębiewski?"],
  [
    "What kind of ceramics does Przemysław Gołębiewski make?",
    "Jaką ceramikę robi Przemysław Gołębiewski?",
  ],
  [
    "Przemysław Gołębiewski shapes vessels, cups and lamps by hand, not by mold. Some pieces stay raw, closer to brutalism; others lean fully organic. Forms may repeat, but never exactly.",
    "Przemysław Gołębiewski kształtuje naczynia, kubki i lampy ręcznie, nie z formy. Niektóre rzeczy zostają surowe, bliżej brutalizmu. Inne idą w pełni w stronę organiczności. Formy mogą wracać, ale nigdy identycznie.",
  ],
  ["The process comes first,", "Najpierw jest proces,"],
  ["always", "zawsze"],
  [
    "Przemysław Gołębiewski, self-taught ceramist at work in Berlin",
    "Przemysław Gołębiewski, ceramik samouk przy pracy w Berlinie",
  ],
  ["Shop the collections", "Zobacz kolekcje"],
  ["Designing a space?", "Projektujesz przestrzeń?"],
  ["Designing a space? Let's talk", "Projektujesz przestrzeń? Porozmawiajmy"],
  ["Originals", "Unikaty"],
  ["Shaped by hand, not by mold", "Kształtowane ręcznie, nie z formy"],
  [
    "Some forms repeat - vessels, cups, lamps - but never exactly. Each one carries its own small differences.",
    "Niektóre formy wracają, naczynia, kubki, lampy, ale nigdy identycznie. Każda niesie własne, drobne różnice.",
  ],
  ["Shop", "Sklep"],
  [
    "Vessels, cups, lamps and objects. Forms that repeat, never exactly.",
    "Naczynia, kubki, lampy i obiekty. Formy, które wracają, ale nigdy identycznie.",
  ],
  ["About", "O mnie"],
  [
    "Przemysław Gołębiewski - self-taught ceramist. Process first, always.",
    "Przemysław Gołębiewski, ceramik samouk. Najpierw jest proces, zawsze.",
  ],
  ["Process", "Proces"],
  [
    "Notes on clay, kiln, texture, and what the material decides.",
    "Zapiski o glinie, piecu, fakturze i o tym, co decyduje materiał.",
  ],
  ["Trade", "Współpraca"],
  [
    "Works for spaces that can hold something raw, organic, or both.",
    "Prace do przestrzeni, które udźwigną coś surowego, organicznego albo jedno i drugie.",
  ],
  ["For architects & designers", "Dla architektów i projektantów"],
  ["Objects for spaces", "Obiekty do przestrzeni"],
  ["that refuse the ordinary.", "które nie godzą się na przeciętność."],
  [
    "Each wall object, vessel and lamp exists as a singular form - shaped by intuition, not brief. Some pieces stay raw, closer to brutalism; others lean fully organic. Most works are placed as they are, into a space that can hold them. In select cases, a new piece takes shape around the scale and context of a room - but always through the same process: the hand moves, the mind follows after. Never to a fixed specification. Never by mold.",
    "Każdy obiekt ścienny, naczynie i lampa istnieje jako pojedyncza forma, kształtowana intuicją, nie briefem. Niektóre rzeczy zostają surowe, bliżej brutalizmu. Inne idą w pełni w stronę organiczności. Większość prac trafia do przestrzeni taka, jaka jest, do miejsca, które potrafi je udźwignąć. W wybranych przypadkach nowa rzecz powstaje wokół skali i kontekstu pomieszczenia, ale zawsze tym samym procesem: ręka idzie przodem, umysł podąża za nią. Nigdy według sztywnej specyfikacji. Nigdy z formy.",
  ],
  ["Wall objects", "Obiekty ścienne"],
  [
    "Handbuilt ceramic pieces for walls. Each exists once. Available for residential and hospitality projects.",
    "Ceramiczne obiekty na ścianę, budowane ręcznie. Każdy istnieje raz. Do projektów mieszkalnych, hotelowych i gastronomicznych.",
  ],
  ["Vessels and objects", "Naczynia i obiekty"],
  [
    "Sculptural forms for shelves, tables and surfaces. Selected, not configured.",
    "Formy rzeźbiarskie na półki, stoły i blaty. Wybierane, nie konfigurowane.",
  ],
  ["Functional ceramics", "Ceramika użytkowa"],
  [
    "Cups, bowls and vessels - forms that repeat, never exactly. Shaped by hand, not by mold.",
    "Kubki, miski i naczynia. Formy, które wracają, ale nigdy identycznie. Kształtowane ręcznie, nie z formy.",
  ],
  [
    "Not every collaboration fits a category. If you see a fit between LELEK and your project - a brand, a gallery, an idea - write to us.",
    "Nie każda współpraca mieści się w kategorii. Jeśli widzisz miejsce dla LELEK w swoim projekcie, marce, galerii albo pomyśle, napisz do nas.",
  ],
  ["Get in touch", "Napisz do nas"],
  ["Send an inquiry", "Wyślij zapytanie"],
  [
    "Tell us about the space - scale, light, the works you're drawn to. We reply within a few business days.",
    "Opowiedz o przestrzeni: skala, światło, prace, które Cię przyciągają. Odpowiadamy w ciągu kilku dni roboczych.",
  ],
  ["Message received.", "Wiadomość dotarła."],
  ["We will get back to you within 1-2 working days.", "Odezwiemy się w ciągu 1-2 dni roboczych."],
  [
    "Ceramic vessels, lamps and wall objects by Przemysław Gołębiewski - for spaces that can hold something raw, organic, or both.",
    "Ceramiczne naczynia, lampy i obiekty ścienne Przemysława Gołębiewskiego, do przestrzeni, które udźwigną coś surowego, organicznego albo jedno i drugie.",
  ],
  [
    "Ceramic objects by Przemysław Gołębiewski for interiors",
    "Ceramiczne obiekty Przemysława Gołębiewskiego do wnętrz",
  ],
  ["Journal", "Proces"],
  ["Notes on process", "Zapiski o procesie"],
  ["and material", "i materiale"],
  ["What the kiln and the material decide together.", "O tym, co razem decydują piec i materiał."],
  ["Works", "Prace"],
  ["Shaped by hand", "Kształtowane ręcznie"],
  ["never exactly", "nigdy identycznie"],
  ["Currently", "Teraz"],
  ["available", "dostępne"],
  ["New in studio", "Nowe w pracowni"],
  ["Earth", "Ziemia"],
  ["Water", "Woda"],
  ["Fire", "Ogień"],
  ["Air", "Powietrze"],
  ["View works", "Zobacz prace"],
  ["My story", "Moja historia"],
  ["Connect", "Spotkanie"],
  ["with", "z"],
  ["the clay.", "gliną."],
  [
    "Wall objects, commissions, a piece for the home - or simply to say something. I work intuitively. I will respond the same way.",
    "Obiekty ścienne, zamówienia, rzecz do domu albo po prostu kilka słów. Pracuję intuicyjnie. Odpowiem tak samo.",
  ],
  ["Message sent. Thank you - we will reply soon.", "Wiadomość wysłana. Dziękujemy, odezwiemy się wkrótce."],
  [
    "Available during open days and selected sales events. Follow Instagram for dates.",
    "Dostępne w dni otwarte i podczas wybranych sprzedaży. Daty są na Instagramie.",
  ],
  [
    "Vessels, cups, lamps and objects - each one a little different from the last.",
    "Naczynia, kubki, lampy i obiekty. Każde trochę inne od poprzedniego.",
  ],
  ["Visit shop ↗", "Odwiedź sklep ↗"],
  ["Find us", "Znajdź nas"],
  ["Online", "W sieci"],
  ["Berlin, Germany", "Berlin, Niemcy"],
  ["Berlin", "Berlin"],
  ["Functional ceramic", "Ceramika użytkowa"],
  ["Vessels", "Naczynia"],
  ["Wall objects and Objects", "Obiekty ścienne i obiekty"],
  ["Prints", "Druki"],
  ["Ceramics", "Ceramika"],
  ["Project inquiry", "Zapytanie o projekt"],
  ["Contact", "Kontakt"],
  ["Galleries", "Galerie"],
  [
    "Gallery partners showing original ceramics by Przemysław Gołębiewski - LELEK, Berlin.",
    "Galerie partnerskie pokazujące oryginalną ceramikę Przemysława Gołębiewskiego, LELEK, Berlin.",
  ],
  [
    "Write to Przemysław Gołębiewski at LELEK in Berlin - commissions, interior projects, or a piece for the home.",
    "Napisz do Przemysława Gołębiewskiego, LELEK w Berlinie: zamówienia, projekty wnętrz albo rzecz do domu.",
  ],
  [
    "Ceramics by Przemysław Gołębiewski - Lelek Studio Berlin",
    "Ceramika Przemysława Gołębiewskiego, Lelek Studio Berlin",
  ],
  ["Printed to order. Shipped from Europe.", "Druk na zamówienie. Wysyłka z Europy."],
  ["Clay Stories Berlin", "Clay Stories Berlin"],
  ["Studio gallery", "Galeria pracowni"],
  ["Wayfinding", "Nawigacja"],
  ["Przemysław Gołębiewski, ceramist", "Przemysław Gołębiewski, ceramik"],
  ["Ceramics by Przemysław Gołębiewski", "Ceramika Przemysława Gołębiewskiego"],
  [
    "Handbuilt ceramic pieces for walls. Each exists once.",
    "Ceramiczne obiekty na ścianę, budowane ręcznie. Każdy istnieje raz.",
  ],
];

const PL_BY_EN = new Map<string, string>(PAIRS.map(([en, pl]) => [en, pl]));

const LONG_DASH = /[—–]/;

export function suggestPl(english: string | undefined | null): string {
  const key = (english ?? "").trim();
  if (!key) return "";
  return PL_BY_EN.get(key) ?? "";
}

export function polishCopyEntries(): ReadonlyArray<readonly [string, string]> {
  return PAIRS;
}

export function polishHasLongDash(value: string): boolean {
  return LONG_DASH.test(value);
}
