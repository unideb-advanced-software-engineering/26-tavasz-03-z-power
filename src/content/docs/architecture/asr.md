---

title: "Z-Power — Architekturálisan jelentős követelmények (ASR-ek)"
description: "Z-Power — Architekturálisan jelentős követelmények (ASR-ek)"

---

## 1. Minőségi attribútumok (Quality Attributes)

- **Megbízhatóság** — az adat nem veszhet el, mert újraküldés nincs.
- **Skálázhatóság** — a termelők száma kiszámíthatatlanul nő a GreenGrant miatt.
- **Rugalmas bővíthetőség** — rengeteg séma, új energiaforrások jöhetnek bármikor.
- **Rendelkezésre állás** — ha a rendszer nincs ott, az egyenlő az adatvesztéssel.

---

## 2. Befolyásos funkcionális követelmények (Influential Functional Requirements)

### REQ-01 — Többféle interfészen keresztüli adatfogadás (REST API, MQTT)

**Miért ASR?** 
Ez nem egyszerűen „két végpont". Az, hogy egyszerre kell REST API-t és MQTT-t támogatni, meghatározza az adatbefogadó réteg architektúráját. Ezek két teljesen különböző protokoll, különböző kapcsolatkezelési modellel (kérés-válasz vs. publish-subscribe). 

Ez egy gateway/adapter réteget kényszerít ki az architektúrában, ami mögött közös feldolgozási pipeline fut. 

Ha ezt rosszul tervezzük meg, később nem lehet szépen bővíteni újabb protokollokkal.

### REQ-02 — Legalább 50 különböző adatséma támogatása, konfigurálhatóan

**Miért ASR?** 
50+ séma nem kezelhető hardkódolt parserekkel. Ez kikényszerít egy sémaregisztert és egy dinamikus validálási/normalizálási réteget. 

Ha ezt az architektúrába nem építjük be az elejétől, hanem „majd megoldjuk", akkor minden új séma egy kóddeploy lesz — ami a rendszer növekedésével fenntarthatatlan. 

**Megjegyzés:**
Ez az egyik pont, ahol a rugalmas bővíthetőség mint architekturális karakterisztika konkrét formát ölt.

### REQ-04 — 7/24 rendelkezésre állás, mert az adatok újraküldésére nincs lehetőség

**Miért ASR?** 
Ez a Z-Power egyetlen legfontosabb követelménye. 

Nem egyszerűen „magas rendelkezésre állás" — itt az elérhetetlenség egyenlő a végleges adatvesztéssel. Ez az egyetlen mondat kikényszeríti a redundáns komponenseket, az üzenetsor-alapú pufferelést, az automatikus failovert és a zero-downtime deploymentet. Gyakorlatilag az egész rendszerarchitektúra erre épül.

**Megjegyzés:**
Ez magábafoglal két minőségi attribútumot is.


### REQ-07 — Üzemzavar-detekció adatküldési mintázat alapján

**Miért ASR?** 
Az üzemzavar-felismerés azt jelenti, hogy a rendszernek folyamatosan figyelnie kell *minden* termelő adatküldési gyakoriságát és mintázatait. 

Ez nem egy egyszerű lekérdezés — ez egy önálló, eseményvezérelt feldolgozó komponens, ami párhuzamosan fut az adatbefogadással. Ha több tízezer termelőt kell figyelni, ez egy külön skálázási és feldolgozási kihívás. 

Ehhez kell egy teljes monitoring réteg.

### REQ-25/26 — Előrejelzés historikus adatokból és külső időjárási adatokból

**Miért ASR?** 
Ez a követelmény egy ML/analitikai modult igényel, ami teljesen más jellegű komponens, mint az adatbefogadás vagy a dashboard. Saját számítási erőforrásokat, időzített futtatást, külső API-függőséget (időjárás) és modellverzió-kezelést igényel. 

Ha ezt nem tervezzük be az architektúrába önálló modulként, össze fog nőni a többi komponenssel, és a frissítése lehetetlenné válik anélkül, hogy a többi részt érintené. 


---

## 3. Kötöttségek (Constraints)

### Adatok újraküldésének hiánya

Az esettanulmány expliciten kimondja: *„azok újbóli elküldésére nincs mód."* Ez a legerősebb kötöttség, ami az egész architektúrát meghatározza. 

Más rendszernél ha elvész egy adat, megkérjük a küldőt, hogy küldje újra. Itt ez nem opció.

Ebből következik az üzenetsor (message  buffer), a tartós tárolás, a redundancia — tulajdonképpen a megbízhatósági és rendelkezésre állási karakterisztikák is ebből a kötöttségből fakadnak.

### Zamunda korlátozott internetinfrastruktúrája

*„Az ország bizonyos területeinek internetlefedettsége hagy némi kívánnivalót maga után."* 
Ez egy adottság, amit nem mi fogunk megváltoztatni. Az architektúrának eleve úgy kell működnie, hogy alacsony sávszélességen, magas késleltetéssel is használható legyen — mind az adatbefogadás (könnyű protokollok, tömörítés), mind a dashboard (progresszív betöltés, minimális JS) oldalán.

### Takarékossági elv (ZDR program kötöttsége)

*„A projektek tervezésénél törekedni kell a takarékosságra."* Ez egy program-szintű kötöttség: nem dobálhatunk pénzt a problémára. Nem mondhatjuk, hogy „vegyünk még 10 szervert." Az architektúrának költséghatékonynak kell lennie, azaz kerülni a túlméretezést, és nyílt forráskódú megoldásokat preferálni.

### Klímabarát célkitűzések

A ZDR program klímabarát filozófiája miatt az üzemeltetés energiahatékonysága is szempont. Ez a takarékossággal együtt az erőforrás-optimalizálás irányába tolja az architektúrát: ne fusson felesleges komponens, a konténerek skálázódjanak le inaktív időszakban, zöld hosting legyen előnyben.

---

## 4. Egyéb befolyásoló tényezők

### Külső időjárás-előrejelzési szolgáltatás függőség

Az előrejelzési modul működése egy külső API-tól függ. Ha ez nem elérhető, az előrejelzés nem tud frissülni. 

Ez azt jelenti, hogy az architektúrában kezelni kell a külső szolgáltatás kiesését (pl.: cache-elés), és érdemes előre gondolkodni azon, hogy a szolgáltató cserélhető legyen.

### GreenGrant portál integrációja

A GreenGrant portál még nem él, de amikor elindul, az új termelők szinkronizálásáról gondoskodni kell. Ez egy külső rendszertől való függőség, ami befolyásolja a termelő-regisztrációs alrendszer tervezését. 

Az API-t úgy kell kialakítani, hogy ezt az integrációt később könnyen rá lehessen csatlakoztatni.

### A diszpécserközpont integrációs igénye

Az országos villamosenergia-hálózat diszpécserközpontja valós idejű adatokat fog lekérni a Z-Power-ből. Ez egy kritikus külső fogyasztó, akinek a rendelkezésre állási és formátum-elvárásai az API-réteg tervezését közvetlenül befolyásolják. 

Tehát: Ha a diszpécserközpont nem kap adatot, az az energiahálózat üzemeltetését veszélyezteti => ez nem opció.
