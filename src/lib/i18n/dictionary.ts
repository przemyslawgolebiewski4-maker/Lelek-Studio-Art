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
  ["For architects & interior designers", "Dla architektów i projektantów wnętrz"],
  ["A space is never just a space.", "Przestrzeń nigdy nie jest tylko przestrzenią."],
  [
    "Ceramic objects that change how a space feels.",
    "Ceramiczne obiekty, które zmieniają odczucie przestrzeni.",
  ],
  [
    "Some spaces need a focal point. Others need texture, contrast or something unexpected. A ceramic object can do more than fill a space - it can shift its atmosphere, create a connection between materials or bring a sense of presence to an otherwise quiet interior.",
    "Niektóre przestrzenie potrzebują punktu skupienia. Inne potrzebują faktury, kontrastu albo czegoś nieoczekiwanego. Ceramiczny obiekt może zrobić więcej, niż tylko wypełnić miejsce. Może zmienić atmosferę, połączyć materiały albo wnieść obecność do cichego wnętrza.",
  ],
  [
    "LELEK creates ceramic wall pieces, vessels, lamps and sculptural objects for residential, hospitality and commercial spaces. Raw, organic forms meet architectural structure, bringing material, texture and a different kind of expression into the spaces we inhabit.",
    "LELEK tworzy ceramiczne obiekty ścienne, naczynia, lampy i formy rzeźbiarskie do przestrzeni mieszkalnych, hotelowych i komercyjnych. Surowe, organiczne formy spotykają strukturę architektury i wnoszą materiał, fakturę oraz inny rodzaj ekspresji do miejsc, w których żyjemy.",
  ],
  [
    "A studio arrangement - the object in relation to a wall, a surface, a light. Not a completed client project.",
    "Układ ze studia. Obiekt wobec ściany, blatu i światła. To nie jest ukończony projekt klienta.",
  ],
  [
    "Ceramic object by Przemysław Gołębiewski placed in an interior",
    "Ceramiczny obiekt Przemysława Gołębiewskiego ustawiony we wnętrzu",
  ],
  ["Made for the space.", "Zrobione dla przestrzeni."],
  ["Shaped by hand.", "Kształtowane ręcznie."],
  [
    "Some works are already made, each existing as a singular form, ready to find its place. Others begin with a conversation.",
    "Część prac już istnieje. Każda jest pojedynczą formą, gotową znaleźć swoje miejsce. Inne zaczynają się od rozmowy.",
  ],
  [
    "Working directly with the artist behind LELEK, you can explore a piece conceived around your project's scale, materials, light and atmosphere. It might be a sculptural wall object, a series of vessels, a lighting element or something that doesn't yet have a name.",
    "W rozmowie z autorem LELEK możesz szukać rzeczy pomyślanej pod skalę projektu, jego materiały, światło i atmosferę. Może to być rzeźbiarski obiekt ścienny, seria naczyń, element oświetlenia albo coś, co nie ma jeszcze nazwy.",
  ],
  [
    "The process is collaborative, but never mechanical. Rather than reproducing a fixed design or following a rigid specification, each commission develops through an exchange of ideas, material exploration and an intuitive approach to form.",
    "Proces jest wspólny, ale nigdy mechaniczny. Zamiast odtwarzać gotowy projekt albo iść za sztywną specyfikacją, każde zamówienie rozwija się przez wymianę myśli, badanie materiału i intuicyjne podejście do formy.",
  ],
  [
    "Every piece is designed and made by one artist, from the first gesture in clay to the finished object. This means a direct connection between the person shaping the work and the person imagining the space.",
    "Każdą rzecz projektuje i wykonuje jeden artysta, od pierwszego gestu w glinie do gotowego obiektu. Jest więc bezpośrednie połączenie między osobą, która kształtuje pracę, a osobą, która wyobraża sobie przestrzeń.",
  ],
  [
    "Not every idea can be made. A commission is taken only when it sits within the practice - the clay, the scale, and what one artist can shape by hand.",
    "Nie każdy pomysł da się wykonać. Zamówienie jest przyjmowane tylko wtedy, gdy mieści się w praktyce: w glinie, w skali i w tym, co jeden artysta może ukształtować ręcznie.",
  ],
  ["An existing work, as it is.", "Istniejąca praca, taka jaka jest."],
  ["Existing ceramic work", "Istniejąca praca ceramiczna"],
  ["In the studio - a form taking shape.", "W pracowni. Forma, która nabiera kształtu."],
  [
    "Ceramic piece taking shape in the studio",
    "Ceramiczna forma nabierająca kształtu w pracowni",
  ],
  ["What can find its place", "Co może znaleźć swoje miejsce"],
  [
    "Handbuilt ceramic pieces that give walls a new dimension. Sculptural forms, textures and shadows that interact with natural and artificial light. Available as existing works or developed for a specific space.",
    "Ceramiczne obiekty budowane ręcznie, które dają ścianom nowy wymiar. Formy rzeźbiarskie, faktury i cienie wchodzą w relację ze światłem naturalnym i sztucznym. Dostępne jako istniejące prace albo rozwijane dla konkretnej przestrzeni.",
  ],
  ["Vessels & sculptural objects", "Naczynia i obiekty rzeźbiarskie"],
  [
    "Ceramic forms for shelves, tables, niches and architectural settings. Objects that can stand alone, complement a composition or introduce a contrast in shape and material.",
    "Ceramiczne formy na półki, stoły, nisze i w ustawienia architektoniczne. Obiekty, które mogą stać samodzielnie, dopełnić kompozycję albo wnieść kontrast kształtu i materiału.",
  ],
  [
    "Cups, bowls and tea objects for interiors where everyday rituals matter. Available as individual pieces or selected series for hospitality, restaurants and other projects.",
    "Kubki, miski i obiekty do herbaty do wnętrz, w których liczy się codzienny rytuał. Dostępne jako pojedyncze rzeczy albo wybrane serie do hoteli, restauracji i innych projektów.",
  ],
  ["Lamps & commissioned works", "Lampy i prace na zamówienie"],
  [
    "Lighting objects and custom ceramic pieces developed in dialogue with your project. From an initial idea to a finished form, each commission is approached as an individual creative process.",
    "Obiekty oświetleniowe i ceramiczne rzeczy rozwijane w dialogu z projektem. Od pierwszego pomysłu do gotowej formy każde zamówienie jest osobnym procesem twórczym.",
  ],
  [
    "Let's give your space a different presence.",
    "Dajmy Twojej przestrzeni inną obecność.",
  ],
  [
    "You don't need to have a finished concept or a precise idea of the object. Sometimes a material, a surface, a feeling or a detail in the architecture is enough to start a conversation.",
    "Nie potrzebujesz gotowej koncepcji ani precyzyjnego wyobrażenia obiektu. Czasem wystarczy materiał, powierzchnia, odczucie albo detal w architekturze, żeby zacząć rozmowę.",
  ],
  [
    "Tell me about your project - the space, its scale, light, materials and what you feel is missing. We can explore whether an existing work is the right fit or develop something specifically for it.",
    "Opowiedz mi o projekcie. O przestrzeni, jej skali, świetle, materiałach i o tym, czego według Ciebie brakuje. Możemy sprawdzić, czy pasuje istniejąca praca, albo rozwinąć coś właśnie dla niej.",
  ],
  [
    "LELEK is an independent ceramic practice by Przemysław Gołębiewski, who designs and makes each commissioned piece by hand in Berlin.",
    "LELEK to niezależna praktyka ceramiczna Przemysława Gołębiewskiego, który w Berlinie projektuje i wykonuje ręcznie każdą rzecz na zamówienie.",
  ],
  [
    "Tell me about your space, your project and the kind of object you have in mind. Include reference images, approximate dimensions and your project timeline if available.",
    "Opowiedz mi o przestrzeni, projekcie i o obiekcie, który masz na myśli. Dołącz zdjęcia odniesienia, przybliżone wymiary i termin, jeśli je masz.",
  ],
  ["Let's start a conversation.", "Zacznijmy rozmowę."],
  [
    "Thank you. I will reply within a few business days.",
    "Dziękuję. Odpowiem w ciągu kilku dni roboczych.",
  ],
  [
    "Existing works, photographed in the studio.",
    "Istniejące prace, sfotografowane w pracowni.",
  ],
  [
    "Ceramic vessels photographed in the studio",
    "Ceramiczne naczynia sfotografowane w pracowni",
  ],
  [
    "Ceramic wall pieces, vessels, lamps and sculptural objects by Przemysław Gołębiewski for residential, hospitality and commercial spaces. Existing works, or a piece shaped with the project.",
    "Ceramiczne obiekty ścienne, naczynia, lampy i formy rzeźbiarskie Przemysława Gołębiewskiego do przestrzeni mieszkalnych, hotelowych i komercyjnych. Istniejące prace albo rzecz kształtowana razem z projektem.",
  ],
  ["Ritual Use Bowl", "Miska do rytuału"],
  ["Stoneware, four glazes mixed with iron oxide", "Kamionka, cztery szkliwa zmieszane z tlenkiem żelaza"],
  ["A bowl shaped for ritual, not just use.\n\nFour glazes mixed by hand with iron oxide in small proportion - the interior shifts between warm earth, celadon green and silver-white depending on the light and the angle. No two look the same. The exterior carries the marks of the wheel and the kiln's temperature.\n\nHold it in both hands. That is how it was made to be used.\n\nOne of a kind. Made in Berlin.", "Miska uformowana do rytuału, nie tylko do użytku.\n\nCztery szkliwa zmieszane ręcznie z niewielką ilością tlenku żelaza. Wnętrze przechodzi między ciepłą ziemią, zielenią seladonu i srebrzystą bielą, zależnie od światła i kąta. Żadne dwie nie wyglądają tak samo. Na zewnątrz zostają ślady koła i temperatury pieca.\n\nTrzymaj ją w obu dłoniach. Tak została pomyślana.\n\nJedyna. Zrobiona w Berlinie."],
  ["Wheel-thrown stoneware. Four commercial glazes mixed by hand with a small proportion of iron oxide - the combination reacts unpredictably during firing, creating the layered earth and green tones visible in the interior. Fired in an electric kiln. The exterior glaze is applied more sparingly, letting the clay body show through.", "Kamionka toczona na kole. Cztery gotowe szkliwa zmieszane ręcznie z niewielką ilością tlenku żelaza. Połączenie reaguje w wypale nieprzewidywalnie i daje warstwy ziemi i zieleni we wnętrzu. Wypał w piecu elektrycznym. Szkliwo na zewnątrz jest położone oszczędniej, żeby prześwitywała glina."],
  ["Ritual Use Bowl - Handmade Stoneware with Iron Oxide Glaze - Lelek Studio Berlin", "Miska do rytuału. Ręczna kamionka ze szkliwem z tlenku żelaza, Lelek Studio Berlin"],
  ["Handmade stoneware bowl with four mixed glazes and iron oxide. Celadon green and warm earth interior. Wheel-thrown, one of a kind by ceramist Przemyslaw Golebiewski, Berlin.", "Ręczna miska z kamionki, cztery zmieszane szkliwa i tlenek żelaza. Wnętrze w zieleni seladonu i ciepłej ziemi. Toczone na kole, jedyne, ceramik Przemysław Gołębiewski, Berlin."],
  ["Anthracite Cup - Iron Oxide Band, 150ml", "Kubek antracytowy, pas tlenku żelaza, 150 ml"],
  ["A small cup shaped for a quiet coffee or tea ritual. The anthracite\nclay body carries white grog - a texture that stays visible even\nunder the glaze, not smoothed away.", "Mały kubek do cichego rytuału kawy albo herbaty. Antracytowa glina niesie biały szamot, fakturę, która zostaje widoczna także pod szkliwem i nie jest wygładzana."],
  ["Wheel-thrown, then trimmed and refined by hand. A band of iron oxide\napplied over the clay, then a transparent glaze - not to cover the\ncolour underneath, but to let it show through, with a sheen close to\ncoal where the oxide sits. Only the foot, where the piece touched the\nkiln shelf, stays bare. Capacity approximately 150ml. One of a kind -\nshaped by hand, so no two cups come out quite the same.", "Toczony na kole, potem obtaczany i dopracowany ręcznie. Pas tlenku żelaza na glinie, potem szkliwo transparentne. Nie po to, żeby zakryć kolor pod spodem, tylko żeby go przepuścić, z połyskiem bliskim węglowi tam, gdzie leży tlenek. Naga zostaje tylko stopka, którą rzecz dotykała półki pieca. Pojemność około 150 ml. Jedyny. Kształtowany ręcznie, więc żadne dwa kubki nie wychodzą takie same."],
  ["Anthracite Cup - Iron Oxide Band | LELEK Berlin", "Kubek antracytowy, pas tlenku żelaza | LELEK Berlin"],
  ["A handbuilt anthracite stoneware cup with white grog and an iron oxide band, shaped by hand in Berlin. One of a kind.", "Ręczny kubek z antracytowej kamionki, z białym szamotem i pasem tlenku żelaza, kształtowany ręcznie w Berlinie. Jedyny."],
  ["SI-001 Silt Cup - Clean Horizon", "SI-001 Kubek Silt, czysty horyzont"],
  ["Stoneware, iron oxide slip, stainless steel wire", "Kamionka, angoba z tlenku żelaza, drut ze stali nierdzewnej"],
  ["Wheel-thrown stoneware cup, 250ml, cream iron oxide glaze, hand-fitted\nstainless steel wire band. Part of the SILT collection - the lightest\ntone I make in this range.\n\nUse and care:\n- 250ml - a full coffee or tea\n- Interior: clear, food-safe glaze; fired to 1240°C\n- Hand wash recommended to preserve the wire finish\n- Stoneware and wire may feel warm with hot contents - normal for\n  handmade stoneware", "Kubek z kamionki toczony na kole, 250 ml, kremowe szkliwo z tlenku żelaza, ręcznie dopasowana opaska z drutu ze stali nierdzewnej. Część kolekcji SILT, najjaśniejszy ton, jaki robię w tej serii.\n\nUżytkowanie i pielęgnacja:\n- 250 ml, pełna kawa albo herbata\n- Wnętrze: klarowne szkliwo dopuszczone do kontaktu z żywnością, wypał 1240°C\n- Zalecane mycie ręczne, żeby zachować wykończenie drutu\n- Kamionka i drut mogą być ciepłe przy gorącej zawartości. To normalne przy ręcznej kamionce."],
  ["How I make it:\n- Same iron oxide, but I mix it thinner for this one, so it fires\n  cream instead of dark rust\n- Applied with my fingers, same as the rest of the range\n- Wire groove carved while trimming, wire fitted by hand after firing", "Jak to robię:\n- Ten sam tlenek żelaza, ale mieszam go rzadziej, więc wypala się na kremowo, nie na ciemną rdzę\n- Nakładam palcami, tak jak w całej serii\n- Rynienka na drut wycinana przy obtaczaniu, drut dopasowany ręcznie po wypale"],
  ["MI-003 Mire Bowl - White Slip Accent", "MI-003 Miska Mire, akcent białej angoby"],
  ["Stoneware, anthracite glaze, white slip accent, stainless steel wire", "Kamionka, szkliwo antracytowe, akcent białej angoby, drut ze stali nierdzewnej"],
  ["Wheel-thrown stoneware bowl, 150ml. Anthracite glaze with a touch of white slip at the base, wrapped in a band of stainless steel - LELEK's signature join.\n\nUse and care:\n- Sized for a ring dish, trinket dish, or small side serving\n- Interior: clear, food-safe glaze; fired to 1240°C\n- Hand wash recommended to preserve the wire finish", "Miska z kamionki toczona na kole, 150 ml. Szkliwo antracytowe z odrobiną białej angoby przy stopie, opasane drutem ze stali nierdzewnej. Charakterystyczne łączenie LELEK.\n\nUżytkowanie i pielęgnacja:\n- Na pierścionki, drobiazgi albo małą przekąskę\n- Wnętrze: klarowne szkliwo dopuszczone do kontaktu z żywnością, wypał 1240°C\n- Zalecane mycie ręczne, żeby zachować wykończenie drutu"],
  ["How I make it:\n- Simple shape again, same reason as the cup - the glaze and wire are\n  already doing a lot of the talking\n- I dip the piece in anthracite, then add a white slip band by hand\n  near the rim before the second dip\n- Wire groove carved during trimming, wire fitted by hand after firing", "Jak to robię:\n- Znowu prosty kształt, z tego samego powodu co przy kubku. Szkliwo i drut już mówią wystarczająco\n- Zanurzam w antracycie, potem ręcznie dodaję pas białej angoby przy krawędzi, przed drugim zanurzeniem\n- Rynienka na drut wycinana przy obtaczaniu, drut dopasowany ręcznie po wypale"],
  ["SI-006 Silt Cup - Cobalt Blue", "SI-006 Kubek Silt, błękit kobaltowy"],
  ["Stoneware, cobalt blue slip, stainless steel wire", "Kamionka, angoba kobaltowa, drut ze stali nierdzewnej"],
  ["Small wheel-thrown stoneware cup, 150ml. Cobalt blue horizon glaze, hand-tested proportions, wrapped in a band of stainless steel.\n\nUse and care:\n- 150ml - suited for espresso, tea, or anything you want to finish\n  slowly\n- Interior: clear, food-safe glaze, separate from the cobalt exterior\n- Fired to 1240°C; hand wash recommended\n- Stoneware and wire may feel warm with hot contents - normal for\n  handmade stoneware", "Mały kubek z kamionki toczony na kole, 150 ml. Horyzontalne szkliwo kobaltowe, proporcje sprawdzone ręcznie, opaska z drutu ze stali nierdzewnej.\n\nUżytkowanie i pielęgnacja:\n- 150 ml, do espresso, herbaty albo czegoś, co chce się pić powoli\n- Wnętrze: klarowne szkliwo dopuszczone do kontaktu z żywnością, osobno od kobaltowego zewnątrz\n- Wypał 1240°C, zalecane mycie ręczne\n- Kamionka i drut mogą być ciepłe przy gorącej zawartości. To normalne przy ręcznej kamionce."],
  ["How I make it:\n- Cobalt oxide, mixed with clay and water in a ratio I've tested by\n  hand - same approach as my iron oxide pieces, different oxide\n- I apply it with my fingers, on the exterior only, below the rim - it\n  never touches the inside or the drinking edge\n- The wire groove is carved during trimming, planned in from the start\n- Wire is hand-fitted into that groove after firing", "Jak to robię:\n- Tlenek kobaltu zmieszany z gliną i wodą w proporcji, którą sprawdziłem ręcznie. To samo podejście co przy tlenku żelaza, inny tlenek\n- Nakładam palcami, tylko na zewnątrz, poniżej krawędzi. Nie dotyka wnętrza ani brzegu, z którego się pije\n- Rynienka na drut wycinana przy obtaczaniu, zaplanowana od początku\n- Drut dopasowany ręcznie w tę rynienkę po wypale"],
  ["SI-007 Silt Cup - Rustic Iron Oxide, Small", "SI-007 Kubek Silt, surowy tlenek żelaza, mały"],
  ["Stoneware, rustic iron oxide slip, stainless steel wire", "Kamionka, surowa angoba z tlenku żelaza, drut ze stali nierdzewnej"],
  ["Small wheel-thrown stoneware cup, 150ml. Soft, rustic iron oxide horizon glaze - unpolished by design, wrapped in a band of stainless steel.\n\nUse and care:\n- 150ml - suited for espresso or a short pour of tea\n- Interior: clear, food-safe glaze; fired to 1240°C\n- Hand wash recommended to preserve the wire finish\n- Stoneware and wire may feel warm with hot contents - normal for\n  handmade stoneware", "Mały kubek z kamionki toczony na kole, 150 ml. Miękkie, surowe szkliwo horyzontalne z tlenku żelaza, z założenia niepolerowane, opasane drutem ze stali nierdzewnej.\n\nUżytkowanie i pielęgnacja:\n- 150 ml, do espresso albo krótkiej herbaty\n- Wnętrze: klarowne szkliwo dopuszczone do kontaktu z żywnością, wypał 1240°C\n- Zalecane mycie ręczne, żeby zachować wykończenie drutu\n- Kamionka i drut mogą być ciepłe przy gorącej zawartości. To normalne przy ręcznej kamionce."],
  ["The rougher texture here comes from how I work the slip while it's\nstill wet - every pass of my fingers leaves a slightly different mark.\n\n- Stoneware, wheel-thrown\n- 150ml capacity\n- Rustic iron oxide slip, hand-applied\n- Stainless steel wire band (1-1.8mm), hand-fitted\n- Fired to 1240°C\n- Made in Berlin, Germany", "Surowsza faktura bierze się z tego, jak pracuję angobą, kiedy jest jeszcze mokra. Każde przejście palców zostawia trochę inny ślad.\n\n- Kamionka, toczona na kole\n- Pojemność 150 ml\n- Surowa angoba z tlenku żelaza, nakładana ręcznie\n- Opaska z drutu ze stali nierdzewnej (1-1,8 mm), dopasowana ręcznie\n- Wypał 1240°C\n- Zrobione w Berlinie, w Niemczech"],
  ["MI-002 Mire Bowl", "MI-002 Miska Mire"],
  ["Stoneware, anthracite glaze, stainless steel wire", "Kamionka, szkliwo antracytowe, drut ze stali nierdzewnej"],
  ["Wheel-thrown stoneware bowl, 230ml. Solid anthracite grey glaze, wrapped in a band of stainless steel - LELEK's signature join. Handmade in Berlin.\n\nUse and care:\n- 230ml - big enough for a real side dish, not just a trinket bowl\n- Interior: clear, food-safe glaze; fired to 1240°C\n- Hand wash recommended to preserve the wire finish", "Miska z kamionki toczona na kole, 230 ml. Jednolite antracytowe szkliwo, opaska z drutu ze stali nierdzewnej. Charakterystyczne łączenie LELEK. Ręcznie, w Berlinie.\n\nUżytkowanie i pielęgnacja:\n- 230 ml, dość na prawdziwy dodatek, nie tylko na drobiazgi\n- Wnętrze: klarowne szkliwo dopuszczone do kontaktu z żywnością, wypał 1240°C\n- Zalecane mycie ręczne, żeby zachować wykończenie drutu"],
  ["How I make it:\n- Same simple-shape approach as the rest of Mire - I don't want the\n  form fighting with the glaze and wire\n- One even glaze dip, no hand-painted slip\n- Wire groove carved during trimming, wire fitted by hand after firing", "Jak to robię:\n- To samo proste podejście do kształtu co w całej serii Mire. Nie chcę, żeby forma kłóciła się ze szkliwem i drutem\n- Jedno równe zanurzenie w szkliwie, bez malowanej angoby\n- Rynienka na drut przy obtaczaniu, drut ręcznie po wypale"],
  ["A cylindrical dark gray ceramic bowl with a smooth, glossy finish. The vessel features straight vertical walls and a flat base, presenting a uniform dark gray color throughout the exterior surface with a subtle horizontal seam line.", "Cylindryczna ciemnoszara miska ceramiczna, gładka, z połyskiem. Proste ścianki i płaska stopa, jednolita ciemna szarość na zewnątrz, z delikatną poziomą linią łączenia."],
  ["What Intuitive Handbuilding Means to Me", "Co intuicyjne lepienie ręczne znaczy dla mnie"],
  ["A ceramist reaches into chaos to catch a shape. Not to tame it - to give it form before the mind understands what the hand already knows.", "Ceramik sięga w chaos, żeby złapać kształt. Nie po to, żeby go ujarzmić. Po to, żeby nadać mu formę, zanim umysł zrozumie to, co ręka już wie."],
  ["Every creative process begins somewhere beyond our world - on another plane. A place where thoughts have no final form yet, where they exist as powerful forces still submerged in chaos. I think that plane is also ours. Maybe a part of us. I think who we are comes from there.\nIn every creation myth there is chaos. Something exists, but has no final shape yet - and yet it is already powerful in itself. The first push from chaos was wild, unformed. The earth still carried that primitive, magical disorder on its surface.\nThat is what Intuitive Handbuilding is for me.\nIt is a process in which my mind reaches into chaos to catch a shape. Not to tame it - that is what I do when I design a collection. This process is different. Primitive. Left entirely to intuition.\nImagine a hand that pierces through a thin layer, catches something mid-flight, breaks through another layer - gives it form - and returns quickly to the body.\nThat is the process. The hand knows before the mind does.", "Każdy proces twórczy zaczyna się gdzieś poza naszym światem, na innej płaszczyźnie. Tam, gdzie myśli nie mają jeszcze ostatecznej formy, gdzie istnieją jako silne siły wciąż zanurzone w chaosie. Myślę, że ta płaszczyzna jest też nasza. Może część nas. Myślę, że stamtąd pochodzi to, kim jesteśmy.\nW każdym micie stworzenia jest chaos. Coś istnieje, ale nie ma jeszcze ostatecznego kształtu, a już jest w sobie potężne. Pierwsze pchnięcie z chaosu było dzikie, nieuformowane. Ziemia wciąż nosiła na powierzchni ten pierwotny, magiczny nieporządek.\nTym jest dla mnie intuicyjne lepienie ręczne.\nTo proces, w którym umysł sięga w chaos, żeby złapać kształt. Nie po to, żeby go ujarzmić. Ujarzmianie zostawiam projektowaniu kolekcji. Ten proces jest inny. Pierwotny. Oddany całkowicie intuicji.\nWyobraź sobie dłoń, która przebija cienką warstwę, łapie coś w locie, przebija kolejną warstwę, nadaje formę i szybko wraca do ciała.\nTaki jest proces. Ręka wie wcześniej niż umysł."],
  ["What Intuitive Handbuilding Means to Me - Lelek Studio Berlin", "Co intuicyjne lepienie ręczne znaczy dla mnie, Lelek Studio Berlin"],
  ["Berlin ceramist Przemyslaw Golebiewski on intuitive handbuilding - a process of reaching into chaos, catching form mid-flight, and returning before the mind can interfere.", "Berliński ceramik Przemysław Gołębiewski o intuicyjnym lepieniu ręcznym: sięganie w chaos, łapanie formy w locie i powrót, zanim wmiesza się umysł."],
  ["From Peatlands to Clay", "Od torfowisk do gliny"],
  ["A self-taught ceramist from rural Poland reflects on peatlands, intuition, and why every grain of sand is different. The story behind Lelek Studio Berlin.", "Ceramik samouk z wiejskiej Polski o torfowiskach, intuicji i o tym, dlaczego każde ziarnko piasku jest inne. Historia Lelek Studio Berlin."],
  ["As a small boy I always followed the pull of nature - that was where I felt safe. Spending hours wandering through the wilderness of the village where I grew up, I forgot about the rest of the world. Only here and now mattered.\n\nNot far from my family home stretched wide peatlands, home to different animals, the sounds of nature, and probably other presences I was not aware of. I slipped away there whenever I could, into my second world - where it was only me, the material things of nature, and whatever lay beyond them.\n\nI never got to finish art school, but that did not stop me from searching for a way to express what I often could not put into words - maybe I still cannot. I am self-taught. I work intuitively, whether painting or working with clay.\n\nIn Berlin, the community in different studios showed me the tools and how to use them. The rest is a process of discovery, of listening to my own intuition. Maybe that is why I almost never make identical things.\n\nEvery grain of sand is different too...", "Jako mały chłopiec zawsze szedłem za ciągiem natury. Tam czułem się bezpiecznie. Godzinami chodziłem po dziczy wsi, w której dorastałem, i zapominałem o reszcie świata. Liczyło się tylko tu i teraz.\n\nNiedaleko domu rodzinnego ciągnęły się szerokie torfowiska, dom różnych zwierząt, dźwięków natury i pewnie innych obecności, których nie byłem świadomy. Wymykałem się tam, kiedy tylko mogłem, do drugiego świata, gdzie byłem tylko ja, materialne rzeczy natury i to, co leżało poza nimi.\n\nNie skończyłem szkoły artystycznej, ale to nie zatrzymało szukania sposobu, żeby wyrazić to, czego często nie umiałem powiedzieć słowami. Może nadal nie umiem. Jestem samoukiem. Pracuję intuicyjnie, czy maluję, czy pracuję z gliną.\n\nW Berlinie środowisko różnych pracowni pokazało mi narzędzia i to, jak ich używać. Reszta jest procesem odkrywania, słuchania własnej intuicji. Może dlatego prawie nigdy nie robię identycznych rzeczy.\n\nKażde ziarnko piasku też jest inne..."],
  ["From Peatlands to Clay - The Story Behind Lelek Studio Berlin", "Od torfowisk do gliny. Historia Lelek Studio Berlin"],
  ["A self-taught ceramist from rural Poland on peatlands, intuition and clay. The personal story behind Lelek Studio Berlin by Przemyslaw Golebiewski.", "Ceramik samouk z wiejskiej Polski o torfowiskach, intuicji i glinie. Osobista historia Lelek Studio Berlin, Przemysław Gołębiewski."],
  ["Lelek Studio Design - handmade stoneware ceramics, wall objects and sculptures by ceramist Przemysław Gołębiewski", "Lelek Studio Design. Ręczna kamionka, obiekty ścienne i rzeźby ceramika Przemysława Gołębiewskiego"],
  ["Lelek Studio Design  - Ceramic Objects & Interior Design", "Lelek Studio Design. Obiekty ceramiczne i wnętrza"],
  ["Selected objects", "Wybrane obiekty"],
  ["Lelek Studio Design - handmade ceramics", "Lelek Studio Design. Ręczna ceramika"],
  ["Lelek - the nightjar - Slavic spirit between worlds", "Lelek, kozodój, słowiański duch między światami"],
  ["visual artist", "artysta wizualny"],
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
