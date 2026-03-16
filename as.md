# Architekturális stílus

A projekthez választott architekturális stílusok az alábbiak:

- Event-driven architecture.
- Microkernel architecture.

## Miért két stílus?

A Z-Power (mint teljes rendszer) felbontható két, eltérő minőségi jellemzőkkel és ASR-ekkel rendelkező alrendszerre:

- A termelési adatok befogadását és feldolgozását végző rendszer.
- A termelési adatok megjelenítését, exportálását és előrejelzését lehetővé tevő rendszer.

Annak érdekében, hogy a két rendszer követelményeit minél jobban kielégíthessük, elviseljük a két stílus egyidejű fenntartásából következő:

- magasabb költségeket,
- magasabb komplexitást,
- alacsonyabb karbantarthatóságot.

## Miért EDA?

### Illeszkedés

A Z-Power adatbefogadó részének architekturális karakterisztikáihoz (megbízhatóság, skálázhatóság, rugalmas bővíthetőség, rendelkezésre állás) remek választás az EDA, hiszen:

- A termelők nem képesek az adatokat újraelküldeni, ezért az adatvesztés-mentes befogadás elsőrendű követelmény.
- A termelők száma nagy, sémáik és beküldési gyakoriságuk változatos.
- A rendszer könnyen bővíthető: új termelőtípus vagy új feldolgozási logika bevezetéséhez elegendő egy új fogyasztót hozzáadni, a meglévő rendszer módosítása nélkül.
- Az eseményvezérelt feldolgozás jól alkalmazkodik a közel valós idejű megjelenítési és riasztási követelményekhez.

### Kompromisszumok

Nem szabad elfelejteni azonban az alábbiakat:

- Magasabb infrastruktúra-költség és üzemeltetési komplexitás, utóbbi hosszabb távon meghatározó szempont, mivel a rendszert hosszú évekig kell majd üzemeltetni.
- Tesztelhetőségi és karbantarthatósági aggályok, mivel az ASW-n ezek kevés csillagocskát kaptak hehe :)
- Nem garantált, hogy az események feldolgozási sorrendje megegyezik a beküldési sorrenddel - ez az idősor-alapú termelési adatoknál torzulást okozhat.
- A termelők sémáinak változásakor az összes érintett fogyasztót frissíteni kell, ami a rendszer bővülésével egyre nehezebben kezelhető karbantartási feladatot jelent.

## Miért Microkernel?

### Illeszkedés

A Z-Power megjelenítő és analitikai részével kapcsolatban nem az adatvesztés-mentesség és a masszív skálázhatóság a fő szempont, hanem a bővíthetőség és a költséghatékonyság, ezért priorizálhatunk olyan jellemzőket, mint:

- alacsony költség,
- rugalmas bővíthetőség (plugineken keresztül),
- tesztelhetőség.

E minőségi jellemzőket nagyszerűen kielégíti a Microkernel architektúra, amelyben az egyes funkciók természetesen leképezhetők pluginekre (dashboard, előrejelzési modul, publikus adatexport). Így például az előrejelzési modul — saját külső API-függőségével és modellverzió-kezelésével — nem nő össze a többi komponenssel.

### Kompromisszumok

Ugyanakkor oda kell figyelnünk az alábbi kompromisszumokra:

- A Microkernel alacsony hibatűréssel rendelkezik, de ez elfogadható: ezen az oldalon nem történik adatbefogadás, tehát egy rövid kiesés nem jelent végleges adatvesztést.
- Korlátozott skálázhatóság, amit a diszpécserközponti integráció szempontjából kezelni kell (dedikált API-réteggel).
- Új funkcionalitás hozzáadásakor előkerülhet az architekturális evolúció kérdése: például service-based architektúrára történő átállás, ha a pluginek száma és komplexitása túlnő a Microkernel keretein.
