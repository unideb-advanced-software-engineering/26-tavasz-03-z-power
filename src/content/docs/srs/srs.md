---

title:  Software Requirements Specification
description:  Software Requirements Specification

---

for

# Z-Power

Version 1.0 approved

Prepared by 
Perjési Fanni, 
Jakab Ács Eszter, 
Tóth Áron Pál

\<organization\>

2026.02.24.

---

## Table of Contents

1. Introduction
   - 1.1 Purpose
   - 1.2 Document Conventions
   - 1.3 Intended Audience and Reading Suggestions
   - 1.4 Product Scope
   - 1.5 References
2. Overall Description
   - 2.1 Product Perspective
   - 2.2 Product Functions
   - 2.3 User Classes and Characteristics
   - 2.4 Operating Environment
   - 2.5 Design and Implementation Constraints
   - 2.6 User Documentation
   - 2.7 Assumptions and Dependencies
3. External Interface Requirements
   - 3.1 User Interfaces
   - 3.2 Hardware Interfaces
   - 3.3 Software Interfaces
   - 3.4 Communications Interfaces
4. System Features
   - 4.1 Adatbefogadás és normalizálás
   - 4.2 Üzemzavar-felismerés
   - 4.3 Valós idejű megjelenítés
   - 4.4 Historikus analitika
   - 4.5 Adatexport
   - 4.6 Előrejelzés
5. Other Nonfunctional Requirements
   - 5.1 Performance Requirements
   - 5.2 Safety Requirements
   - 5.3 Security Requirements
   - 5.4 Software Quality Attributes
   - 5.5 Business Rules
6. Other Requirements

### Revision History

| Name | Date | Reason For Changes | Version |
|------|------|--------------------|---------|
|      |      |                    |         |

---

## 1. Introduction

### 1.1 Purpose

Ez a dokumentum a Z-Power platform szoftverkövetelményeit tartalmazza. A Z-Power a Zamunda Digitális Reneszánsz (ZDR) program keretében fejlesztett megújulóenergia-monitorozó és -előrejelző rendszer. A dokumentum a teljes platform követelményeit lefedi.

### 1.2 Document Conventions

A dokumentumban a következő konvenciók érvényesek:
- A követelmények egyedi REQ-XX azonosítóval rendelkeznek.
- A prioritások jelölése: Magas, Közepes, Alacsony.
- A magasabb szintű követelmények prioritása öröklődik az alájuk tartozó részletes követelményekre, hacsak külön nem jelöljük.
- A „TBD" jelölés olyan információt jelöl, amely még nem áll rendelkezésre.

### 1.3 Intended Audience and Reading Suggestions

Ez az SRS bármely, a projektben résztvevő munkatárs számára érdekes és hasznos lehet, technikai ismeretektől függetlenül.

### 1.4 Product Scope

A Z-Power egy központi energiamonitorozó és -előrejelző platform, amely a Zamunda területén működő megújuló energiaforrások (napelemparkok és szélerőművek) termelési adatait gyűjti, tárolja, vizualizálja és elemzi. A platform célja:
- A megújuló energiatermelés átláthatóságának biztosítása Zamunda energetikai ügynöksége számára.
- Üzemzavarok gyors felismerése és jelzése.
- Időjárásfüggő energiatermelési előrejelzések készítése az energiahálózat stabilitásának támogatására.
- Historikus adatok nyilvános exportálása kutatási és kormányzati célokra.

A rendszer közvetlenül illeszkedik a ZDR program fenntarthatósági és digitális transzformációs stratégiájához, valamint Zamunda klímabarát célkitűzéseihez.

### 1.5 References

https://unideb-advanced-software-engineering.github.io/site/hu/scenarios/03-z-power/

---

## 2. Overall Description

### 2.1 Product Perspective

A Z-Power egy teljesen új, önálló rendszer, amely a ZDR program részeként kerül fejlesztésre. Nem vált ki korábbi szoftvert, mivel Zamundában eddig nem működött egységes megújulóenergiamonitorozó platform. A Z-Power az ország energetikai ügynökségének meglévő informatikai infrastruktúrájába illeszkedik, és együtt kell működnie az országos villamosenergia-hálózat diszpécserrendszerével. A rendszernek integrálódnia kell a ZDR program egyéb komponenseivel, különösen a GreenGrant pályázati portállal, amely várhatóan jelentős mértékben növeli a regisztrált termelők számát.

### 2.2 Product Functions

A Z-Power fő funkciói a következők:
- Adatbefogadás: különböző sémájú és gyakoriságú termelési adatok fogadása a megújuló energiatermelőktől.
- Adatvalidáció és normalizálás: a beérkező heterogén adatok egységes formátumra hozása.
- Üzemzavar-felismerés: automatikus detektálás, ha egy termelő egység nem küld adatot, vagy szokatlan mintázatot mutat.
- Valós idejű megjelenítés: a termelési adatok és üzemzavarok közel valós idejű dashboardon történő megjelenítése.
- Historikus analitika: historikus termelési adatok alapján analitikai dashboardok biztosítása.
- Adatexport: a termelési adatok meghatározott időközönkénti nyilvános exportálása.
- Előrejelzés: a korábbi termelési adatok és a várható időjárás alapján energiatermelési előrejelzések készítése.

### 2.3 User Classes and Characteristics

A rendszer felhasználói osztályai:
- Energiatermelők (napelemparkokés szélerőművek üzemeltetői)
- Zamunda Energetikai Ügynökség
- Nagyfogyasztók
- Egyéb erőművek (nem megújuló)
- Adminok

### 2.4 Operating Environment

Még nincsenek ilyen jellegű követelmények.

### 2.5 Design and Implementation Constraints

- Skálázhatóság: a rendszernek fel kell készülnie a termelők számának dinamikus növekedésére
- Állami szabályozás: a rendszernek meg kell felelnie Zamunda adatvédelmi és kritikus infrastruktúra-védelmi előírásainak
- Hálózati korlátok: a rendszert úgy kell tervezni, hogy alacsony sávszélességű és magas késleltetésű kapcsolatokon is működjön
- Adatmegőrzés: mivel a termelési adatok újraküldésére nincs lehetőség, a rendszernek garantálnia kell az adatok biztonságos fogadását és tartós tárolását.

### 2.6 User Documentation

Még nincsenek ilyen jellegű követelmények.

### 2.7 Assumptions and Dependencies

Feltételezések:
- A termelők képesek valamilyen formában (automatikusan vagy manuálisan) adatot küldeni a rendszernek
- A GreenGrant portál API-n keresztül elérhető lesz a regisztrált új termelők adatainak szinkronizálásához
- Időjárás-előrejelzési adatok elérhetők egy külső szolgáltatón vagy meteorológiai API-n keresztül.

Függőségek:
- Külső időjárás-előrejelzési szolgáltatás rendelkezésre állása.
- GreenGrant indulás

---

## 3. External Interface Requirements

### 3.1 User Interfaces

- Valós idejű, térkép alapú dashboard
- Üzemzavar nézet, térképpel
- Adminisztrátori felület
- Historikus analitikai dashboard: szűrhető idősoros grafikonok, aggregált statisztikák és összehasonlítások termelőtípus, régió és időszak szerint.
- Előrejelzési nézet: a várható termelés vizuális megjelenítése időjárási adatokkal kombinálva.

A felületnek reszponzívnak kell lennie (mobilra legalább).
Alacsony sávszélességen is használhatónak kell lennie.

### 3.2 Hardware Interfaces

Az erőművek és napelemparkok IoT eszközei, amik adatot küldenek.

### 3.3 Software Interfaces

A rendszer szoftveres interfészei:
- Időjárás-előrejelzési API: külső meteorológiai szolgáltató REST API-ja, amely hőmérséklet-, szél- és napfényadatokat biztosít
- GreenGrant portál API: a regisztrált új termelők adatainak szinkronizálása REST API-n keresztül
- Országos villamosenergia-hálózat diszpécserrendszere: adatmegosztás a hálózatirányítás felé
- Idősor-adatbázis: a termelési adatok tárolása (pl. TimescaleDB vagy InfluxDB).

### 3.4 Communications Interfaces

Kommunikációs követelmények:
- A termelői adatbefogadás HTTPS-alapú (REST API-n és MQTT) protokollokon keresztül valósul meg.
  - MQTT: Message Queueing Telemetry Transport, IoT eszközökre tervezett könnysűsúlyú üzenetküldési protokoll.
- Az adatexport HTTPS-en keresztül letölthető fájlok formájában történik (CSV, JSON)
- Üzemzavar-riasztások e-mail értesítés formájában érkeznek
- Az adatforgalom minimalizálása érdekében tömörítés (gzip) alkalmazása a kérések és válaszok esetén.
- Titkosítás mindenre (TLS)

---

## 4. System Features

### 4.1 Adatbefogadás és normalizálás

#### 4.1.1 Description and Priority

A rendszer képes a megújuló energiatermelők által küldött, különféle sémájú és gyakoriságú termelési adatok fogadására és egységes formátumra alakítására. Ez a rendszer alapfunkciója, amely nélkül a többi funkció nem működik.

Prioritás: Magas

#### 4.1.2 Stimulus/Response Sequences

- A termelő egység (automatikusan vagy manuálisan) elküldi a termelési adatot az API végpontra.
- A rendszer fogadja és validálja az adatot.
- Sikeres validáció esetén az adat normalizálásra kerül, majd eltárolódik.
- Hibás adat esetén a rendszer hibaüzenetet küld vissza, és naplózza az eseményt

#### 4.1.3 Functional Requirements

| Azonosító | Leírás | Prioritás |
|-----------|--------|-----------|
| REQ-01 | A rendszernek különböző (fentebb felsorolt) interfészeken keresztül kell tudnia termelési adatokat fogadni. | Magas |
| REQ-02 | A rendszernek legalább 50 különböző adatsémát kell támogatnia, amelyeket konfigurációval lehet bővíteni. | Magas |
| REQ-03 | A rendszernek a beérkező adatokat egységes belső formátumra kell normalizálnia. | Magas |
| REQ-04 | A rendszernek 7/24 rendelkezésre kell állnia az adatbefogadáshoz, mivel az adatok újraküldésére nincs lehetőség. | Magas |
| REQ-05 | A rendszernek validálnia kell a beérkező adatokat (formátum, értéktartomány) és részletes hibaüzenetet kell visszaadnia hibás adat esetén. | Magas |
| REQ-06 | A rendszernek támogatnia kell az adatok tömörített (gzip) küldését az alacsony sávszélességű termelők számára. | Közepes |

### 4.2 Üzemzavar-felismerés

#### 4.2.1 Description and Priority

A rendszer automatikusan felismeri a termelők üzemzavarait az adatküldési minták és a termelési értékek elemzése alapján.

Prioritás: Magas

#### 4.2.2 Stimulus/Response Sequences

1. A rendszer folyamatosan figyeli a termelők adatküldési gyakoriságát és termelési mintázatait.
2. Ha egy termelő nem küld adatot az elvárt időn belül, vagy szokatlan értékeket küld, a rendszer üzemzavart jelez.
3. Az üzemzavar megjelenik a dashboardon és értesítés kerül kiküldésre az érintett felhasználóknak.

#### 4.2.3 Functional Requirements

| Azonosító | Leírás | Prioritás |
|-----------|--------|-----------|
| REQ-07 | A rendszernek detektálnia kell, ha egy termelő egység nem küld adatot az elvárt időintervallumon belül, vagy helytelenül küldi azt. | Magas |
| REQ-08 | A rendszernek detektálnia kell a szokatlan termelési mintázatokat (pl. hirtelen nullára esés, irreálisan magas értékek). | Magas |
| REQ-09 | Az üzemzavar detektálástól számított legkésőbb 60 másodpercen belül meg kell jelennie a dashboardon (p90*). | Magas |
| REQ-10 | A rendszernek e-mail és/vagy webhook értesítést kell küldenie üzemzavar észlelésekor a konfigurált címzetteknek. | Közepes |
| REQ-11 | Az üzemzavarok típusát és súlyosságát kategorizálni kell (kritikus, figyelmeztetés, információs). | Közepes |

*p90: az üzemzavarok jelzésének 90%-a az említett 60 másodperces határ alá esik; ennél lassabb csak a jelzések 10%-a lehet.

### 4.3 Valós idejű megjelenítés

#### 4.3.1 Description and Priority

A termelési adatok és üzemzavarok közel valós idejű megjelenítése interaktív dashboardon, térkép-alapú nézettel.

Prioritás: Magas

#### 4.3.2 Stimulus/Response Sequences

1. A felhasználó megnyitja a valós idejű dashboardot.
2. A rendszer megjeleníti az aktuális termelési adatokat és üzemzavar-státuszokat.
3. Az adatok automatikusan frissülnek új adatok beérkezésekor.

#### 4.3.3 Functional Requirements

| Azonosító | Leírás | Prioritás |
|-----------|--------|-----------|
| REQ-12 | A dashboardnak térkép-alapú nézetet kell biztosítania, amelyen a termelők földrajzi elhelyezkedése és aktuális státusza látható. | Magas |
| REQ-13 | A termelési adatoknak legfeljebb p90* 10 perces időközönként kell frissülnie. | Magas |
| REQ-14 | A dashboardnak megjelenítenie kell az összesített termelési adatokat (régió, típus, ország szinten). | Magas |
| REQ-15 | A dashboardnak alacsony sávszélességű kapcsolaton is használhatónak kell lennie (progresszív betöltés**, minimális adatforgalom). | Magas |
| REQ-16 | A felhasználónak tudnia kell szűrnie: termelőtípus, régió és kapacitás szerint. | Közepes |

*p90: Az esetek 90%-ában az adatok 10 perces időközönként frissülnek. Az esetek maradék 10%-ában több időbe telik a frissülés.

**progresszív betöltés: csak a szükséges adat betöltése, nem egyszerre az egész oldalé. Csak akkor tölti be az adatokat, ha szükségesek. UX***-et részesíti előnyben, minimalizálja az adatforgalmat.

***UX: User experience, felhasználói élmény

### 4.4 Historikus analitika

#### 4.4.1 Description and Priority

A historikus termelési adatok alapján analitikai dashboardok biztosítása, amelyek lehetővé teszik a trendek, összehasonlítások és mintázatok elemzését.

Prioritás: Közepes

#### 4.4.2 Stimulus/Response Sequences

1. A felhasználó kiválasztja az időszakot és szűrőfeltételeket.
2. A rendszer lekérdezi a historikus adatokat és megjeleníti a grafikonokat és statisztikákat.
3. A felhasználó interaktívan módosíthatja a szűrőket és időszakot.

#### 4.4.3 Functional Requirements

| Azonosító | Leírás | Prioritás |
|-----------|--------|-----------|
| REQ-17 | A rendszernek szűrhető idősoros grafikonokat (vonaldigrammokat az idősoros adatok vizualizálására) kell biztosítania a termelési adatokhoz. | Közepes |
| REQ-18 | A rendszernek lehetővé kell tennie összehasonlításokat termelőtípus, régió és időszak szerint. Egy- és több diagrammos nézeteken is meg kell tudnia jeleníteni. | Közepes |
| REQ-19 | A rendszernek aggregált statisztikákat kell megjelenítenie (átlag, csúcs, minimum, összes termelés). | Közepes |
| REQ-20 | A historikus adatok lekérdezésének válaszideje legfeljebb p90* 5 másodperc egy éves adattartományra. | Közepes |

*p90: az esetek legfeljebb 90%-ban az éves adatok lekérdezése nem lesz több, mint 5 másodperc. A maradék esetben több lehet.

### 4.5 Adatexport

#### 4.5.1 Description and Priority

Az adatok adott időközönkénti nyilvános exportálása, hogy kutatóintézetek és más hivatalok dolgozzanak velük.

Prioritás: Közepes

#### 4.5.2 Stimulus/Response Sequences

1. A rendszer az előre beállított időközönként automatikusan létrehozza az export fájlokat.
2. Az export fájlok nyilvánosan elérhető helyre kerülnek feltöltésre.
3. A kutatóintézetek és hivatalok letöltik a fájlokat.

#### 4.5.3 Functional Requirements

| Azonosító | Leírás | Prioritás |
|-----------|--------|-----------|
| REQ-21 | A rendszernek konfigurálható időközönként (pl. naponta, hetente, havonta, stb) automatikusan exportálnia kell az új termelési adatokat. | Közepes |
| REQ-22 | Az export formátumok: CSV és JSON. | Közepes |
| REQ-23 | Az exportált adatoknak nyilvánosan, autentikáció nélkül elérhetőnek kell lenniük HTTPS-en keresztül. | Közepes |
| REQ-24 | Az exportált fájloknak tartalmazniuk kell metaadatokat (időszak, generálás dátuma, formátum verzió). | Alacsony |

### 4.6 Előrejelzés

#### 4.6.1 Description and Priority

A korábbi termelési adatok és a várható időjárás alapján energiatermelési előrejelzések készítése, amelyek segítik a hálózat-üzemeltetési és kapacitástervezési döntéseket.

Prioritás: Közepes

#### 4.6.2 Stimulus/Response Sequences

1. A rendszer megadott időközönként lekérdezi a külső időjárás-előrejelzési adatokat.
2. Az időjárási adatok és a historikus termelési adatok alapján a rendszer előrejelzést készít.
3. Az előrejelzés megjelenik a dashboardon és elérhető API-n keresztül.

#### 4.6.3 Functional Requirements

| Azonosító | Leírás | Prioritás |
|-----------|--------|-----------|
| REQ-25 | A rendszernek legalább 24 és 72 órás előrejelzést kell készítenie a várható energiatermelésről. | Magas |
| REQ-26 | Az előrejelzésnek figyelembe kell vennie a historikus termelési adatokat és a külső időjárás-előrejelzést, pl hőmérséklet, szélsebesség, napsugárzás, felhőzet. | Magas |
| REQ-27 | Az előrejelzéseket legalább p90* 12 óránként frissíteni kell. | Közepes |
| REQ-28 | Az előrejelzéseket API végponton is elérhetővé kell tenni a külső rendszerek (pl. diszpécserközpont) számára. | Közepes |
| REQ-29 | A rendszernek meg kell jelenítenie az előrejelzés konfidenciáját**. | Alacsony |

*p90: Az esetek 90%-ban az előrejelzés 12 óránként frissülni fog. A maradék esetben nagyobb időközönként.

**az előrejelzés konfidenciája: megbízhatóági szintje az előrejelzésnek a számára elérhető adatok alapján.

---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements

- **ZP-NF-PERF-01**: A rendszernek legalább 10 000 egyidejű adatbeküldést kell tudnia kezelni percenként.
- **ZP-NF-PERF-02**: A valós idejű dashboard frissítési késleltetése legfeljebb p90 10 perc.
- **ZP-NF-PERF-03**: A historikus lekérdezések válaszideje legfeljebb p90 5 másodperc egy éves adattartományra.
- **ZP-NF-PERF-04**: A rendszernek skálázhatónak kell lennie a termelők számának növekedésével

### 5.2 Safety Requirements

- **ZP-NF-SAFE-01**: A rendszerhibák nem okozhatnak az energiahálózat működésére veszélyes állapotot
  - Mivel a rendszer csak monitorozó funkciót lát el, nem vezérel.
- **ZP-NF-SAFE-02**: Az üzemzavar-riasztásoknak megbízhatóan kell működniük; hamis negatívok minimalizálása kiemelt prioritás.
- **ZP-NF-SAFE-03**: Az adatvesztés megelőzése érdekében a rendszernek redundáns adattárolást kell biztosítania
  - Biztonsági mentések használata!

### 5.3 Security Requirements

- **ZP-NF-SEC-01**: A termelők API-hozzáférése API-kulcsos vagy tanúsítványalapú autentikációval védett.
- **ZP-NF-SEC-02**: A webes felület bejelentkezés-alapú, szerepkör-alapú hozzáférés-vezérléssel (RBAC).
  - RBAC: Role-Based Access Control
- **ZP-NF-SEC-03**: A termelési adatok és személyes adatok kezelése megfelel Zamunda adatvédelmi előírásainak.
- **ZP-NF-SEC-04**: Rendszeres biztonsági auditok és penetrációs tesztek szükségesek.
  - Rendszeres Compliance vizsgálatok
- **ZP-NF-SEC-05**: Az audit logoknak rögzíteniük kell minden hozzáférési és módosítási eseményt

### 5.4 Software Quality Attributes

- **Rendelkezésre állás:**
  - Egy termelő egység (forrás) termelési adatot küld az adatbefogadó végpontra/API-ra (stimulus) az adatbefogadó modulon keresztül (érintett pont), aminek hatására a rendszer fogadja, elbírálja, majd feldolgozza az adatot.
  - Ez megtörténik még tervezett karbantartás vagy részleges komponenshiba esetén is (válasz). Éves szinten a rendszer legalább az idő 99,9%-ában elérhető (metrika).

- **Skálázhatóság:**
  - A GreenGrant pályázatok hatására tízezer új termelő regisztrál a rendszerbe egy negyedév alatt (forrás/stimulus), ami az adatbefogadó modult és a valós idejű dashboardot terheli (érintett pontok).
  - Ennek hatására a rendszer automatikusan skálázódik és kiszolgálja az összes kérést (válasz).
  - A rendszer nem p90 terhelődik túl akár 100 000 egyidejűleg aktív termelő esetén sem (metrika).
    - p90: az esetek 90%-ban nem terhelődik túl, a maradék 10%-ban túlterhelődés miatt észrevehetően lassabban reagál.

- **Karbantarthatóság (a moduláris architektúra miatt):**
  - A fejlesztőcsapat (forrás) az előrejelzési modul gépi tanulási modelljét szeretné frissíteni (stimulus) az előrejelzési modulban (érintett pont).
  - Ennek hatására az új modellverzió telepíthető anélkül, hogy az adatbefogadó, a dashboard vagy az analitikai modul működését érintené (válasz).
  - Egyetlen modul frissítése p90 legfeljebb 4 óra fejlesztői munkát igényel a telepítésig, és nem keletkezik módosítási igény más modulokban (metrika).
    - p90: az esetek 90%-ban maximum 4 óra a karbantartás, a többiben több.

- **Könnyen használhatóság:**
  - Az Energetikai Ügynökség egy új munkatársa (forrás) előzetes technikai képzés nélkül először nyitja meg a valós idejű dashboardot (stimulus) a webes felületen (érintett pont).
  - Ennek hatására képes megtalálni egy adott régió aktuális összesített termelési adatait és az aktív üzemzavarokat (válasz).
  - Az új felhasználó legfeljebb 15 percen belül sikeresen végrehajtja az első érdemi lekérdezést külső segítség nélkül (metrika).

- **Megbízhatóság:**
  - Nagyszámú termelő (forrás) egyszerre küld adatot egy vihar utáni újrainduláskor, miközben az adatbázis-szerver átmenetileg túlterhelt (stimulus).
  - Ez az adatbefogadó modult érinti (érintett pont).
  - Ennek hatására a rendszer egy várakozási sorban puffereli a beérkező adatokat, és a hiba elmúltával feldolgozza azokat (válasz).
  - Az adatvesztés mértéke 0 üzenet, még p99 10 perces adatbázis-kiesés esetén is (metrika).
    - p99: az esetek 99%-ban egy 10 perces leállás nem okoz adatvesztést, a többi esetben okozhat.

- **Hordozhatóság:**
  - Az üzemeltető csapat (forrás) a rendszert a kormányzati adatközpontból egy felhőszolgáltató környezetébe kívánja áttelepíteni (stimulus), ami a teljes rendszert érinti (érintett pont).
  - Ennek hatására a konténerizált komponensek a célkörnyezetben újratelepíthetők (válasz).
  - Az áttelepítés legfeljebb p90 1 munkanapot vesz igénybe, és nem igényel forráskód-módosítást, kizárólag konfigurációs változtatásokat (metrika).
    - p90: az esetek 90%-ban 1 munkanapot vesz igénybe az átköltöztetése a rendszernek, a maradék esetben többet is vehet.

- **Tesztelhetőség:**
  - Egy fejlesztő (forrás) módosítja az üzemzavar-felismerő modul detekciós logikáját (stimulus) az üzemzavar-felismerő modulban (érintett pont).
  - Ennek hatására a CI/CD pipeline automatikusan lefuttatja az egység- és integrációs teszteket, és jelzi a regressziókat (válasz).
  - Minden modul legalább 80%-os kódlefedettséggel rendelkezik, és a teljes tesztcsomag lefutási ideje p90 nem haladja meg a 30 percet (metrika).
    - p90: Az esetek 90%-ában a tesztek nem tartanak tovább fél óránál, a maradék esetben tovább is tarthat.

- **Biztonság:**
  - Egy külső támadó (forrás) hamis termelési adatokat próbál küldeni egy ellopott vagy kitalált API-kulccsal az adatbefogadó REST végpontra (stimulus), ami az adatbefogadó modul autentikációs rétegét érinti (érintett pont).
  - Ennek hatására a rendszer elutasítja a kérést, naplózza a sikertelen hitelesítési kísérletet, és a konfigurált küszöb túllépése esetén automatikusan blokkolja a forrás IP-címét (válasz).
  - Az érvénytelen hitelesítési kísérletek 100%-a elutasításra kerül, az auditnapló-bejegyzés p90 1 másodpercen belül létrejön, és 5 sikertelen kísérlet után az IP-cím automatikusan 30 percre blokkolódik (metrika).
    - p90: az esetek 90%-ban 1 másodpercen belül logol és kezdi a védelmi intézkedéseket a rendszer.

- **Alacsony késleltetés:**
  - Egy napelempark (forrás) termelési adatot küld egy alacsony sávszélességű, magas késleltetésű vidéki kapcsolaton (stimulus), ami az adatbefogadó modult és az üzenetsor-feldolgozót érinti (érintett pontok).
  - Ennek hatására a rendszer nyugtázza az adat fogadását és elvégzi a normalizálást (válasz).
  - A nyugtázás a kliens szempontjából legfeljebb p90 5 másodpercen belül megtörténik magas hálózati késleltetés mellett is, és a normalizált adat legfeljebb 30 másodpercen belül megjelenik a belső adattárban (metrika).
    - p90: az esetek 90%-ban 5 másodpercen belül nyugtáz a rendszer, magas késleltetéskor is, valamint 30 másodpercen belül megjelenik az adat a tárban. A maradék 10%-ban több időt vesz igénybe.

- **Rugalmas bővíthetőség:**
  - A Zamundai Energetikai Ügynökség (forrás) úgy dönt, hogy a rendszerbe egy új energiaforrástípust (pl. geotermikus erőmű) is bevon, saját adatsémával és termelési jellemzőkkel (stimulus), ami az adatbefogadó modul sémaregisztrációját, a normalizálót és a dashboardot érinti (érintett pontok).
  - A változtatás hatására az új energiaforrás típusát konfigurációval és legfeljebb minimális fejlesztéssel be lehet vezetni (válasz).
  - Az új energiaforrás-típus felvétele legfeljebb p90 5 munkanapot igényel, forráskód-módosítás nélkül vagy legfeljebb egyetlen modul érintésével, és a meglévő termelők adatfeldolgozása közben sem lép fel leállás (metrika).
    - p90: az esetek 90%-ban nem tart 5 munkanapnál tovább az új típus felvitele és nem okoz leállást. A maradék 10%-ban több ideig tart, esetleg részleges leállással.

- **Visszaállíthatóság (Recoverability):**
  - Egy hardverhiba (forrás) miatt az elsődleges adatbázis-szerver váratlanul leáll (stimulus), ami az adattárolási réteget és az összes arra épülő modult érinti (érintett pontok).
  - A leállás hatására a rendszer automatikusan átáll a tartalék (replika) adatbázisra, és az üzenetsorban várakozó adatok feldolgozása folytatódik (válasz).
  - A szolgáltatás legfeljebb p90 30 másodpercen belül helyreáll, adatvesztés nem keletkezik, és a felhasználók legfeljebb egy rövid hibaüzenetet tapasztalnak az átállás ideje alatt (metrika).
    - p90: az esetek 90%-ban 30 másodpercen belül helyreáll a rendszer elérhetősége, adatvesztés nélkül. A maradék 10%-ban tovább tart, vagy minimális adatvesztés felléphet.

- **Interoperabilitás:**
  - Az országos villamosenergia-hálózat diszpécserközpontja (forrás) valós idejű termelési összesítéseket kér le a Z-Power rendszerből a saját hálózatirányító szoftverébe történő integrációhoz (stimulus), ami a Z-Power külső API rétegét érinti (érintett pont).
  - A kérés hatására a rendszer szabványos formátumban szolgáltatja az adatokat (válasz).
  - Az API válaszai dokumentált, verziózott sémát követnek, az integráció egy új külső rendszerrel legfeljebb 3 munkanap alatt megvalósítható a nyilvános API-dokumentáció alapján (metrika).

### 5.5 Business Rules

Nincsenek különleges üzleti szabályok.

---

## 6. Other Requirements

\<Define any other requirements not covered elsewhere in the SRS. This might include database requirements, internationalization requirements, legal requirements, reuse objectives for the project, and so on. Add any new sections that are pertinent to the project.\>

## Appendix A: Glossary

\<Define all the terms necessary to properly interpret the SRS, including acronyms and abbreviations. You may wish to build a separate glossary that spans multiple projects or the entire organization, and just include terms specific to a single project in each SRS.\>

## Appendix B: Analysis Models

\<Optionally, include any pertinent analysis models, such as data flow diagrams, class diagrams, state-transition diagrams, or entity-relationship diagrams.\>

## Appendix C: To Be Determined List

\<Collect a numbered list of the TBD (to be determined) references that remain in the SRS so they can be tracked to closure.\>