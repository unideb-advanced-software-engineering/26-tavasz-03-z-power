# Z-Power — Architekturális karakterisztikák

---

## 1. Megbízhatóság

Szerintünk ez a Z-Power legfontosabb architekturális jellemzője, és egy mondat miatt:
*„a termelési adatok újbóli elküldésére nincs mód."*

Ha egy adat elvész, az annyi — nincs második esély/újraküldés. Emiatt az egész rendszert úgy kell felépíteni, hogy az adat a beérkezés pillanatától fogva biztonságban legyen: üzenetsoros pufferelés (message queue buffer), azonnali nyugtázás, tartós tárolás még a feldolgozás előtt.

Valamint mivel ez egy kritikus infrastruktúrát felügyelő rendszer, ha hiányoznak az adatok, az energiahálózat üzemeltetését is veszélyezteti.

Lényegében minden komponensnél az az első kérdés: „Ha ez elromlik, elveszhet adat?"

---

## 2. Skálázhatóság

Most néhány száz nagy és pár tízezer kisebb termelő van. De a GreenGrant pályázatok miatt ez a szám bármikor, kiszámíthatatlanul megugorhat.

Ezért már a kezdetektől úgy kell tervezni, hogy az adatbefogadás, a feldolgozás és a dashboard is horizontálisan skálázódjon (terheléselosztás miatt). 

Ha ezt nem kezeljük az architektúrában, a rendszer az első nagyobb hullám termelőnél lehal.

---

## 3. Rugalmas bővíthetőség

Két dolog is indokolja. 
- Egyrészt a termelők mindenféle sémában küldhetik az adatokat — nincs egységes formátum. 
- Másrészt a rendszernek fel kell készülnie arra, hogy holnap jön egy új energiaforrás-típus (pl.: geotemrikus, stb), amit szintén kezelni kell.

Ha minden új séma vagy energiaforrás egy fejlesztési projektet indít, az drága és lassú. Szóval az architektúrának eleve plugin-szerűen, konfigurálhatóan kell működnie: 
- sémaregiszter
- adapterek
- normalizáló réteg

---

## 4. Rendelkezésre állás

Ez hasonlíthat a megbízhatóságra, de más a lényege. 

A megbízhatóság: *ha beérkezik az adat, ne vesszen el*, míg a rendelkezésre állás: *a rendszer egyáltalán legyen ott, amikor az adat jön*.

A mögöttes helyzet nem változott: ha nincs újraküldés, akkor a rendszer egy percnyi kiesése is végleges adathiányt jelent, emiatt kell redundancia, automatikus failover, zero-downtime deployment, és karbantartás közbeni adatfogadás. 

Általában a rendszereknél a 99,9% rendelkezésre állás egy szép vállalás — itt viszont kemény követelmény, mert ha a rendszer nem elérhető, az gyakorlatilag adatvesztés.