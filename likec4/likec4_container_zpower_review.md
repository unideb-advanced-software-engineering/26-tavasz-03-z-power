specification {
  element user {
    style {
      shape person
      color green
    }
  }

  element system

  element externalSystem {
    style {
      color: amber
    }
  }

  element frontend {
    style {
      shape browser
    }
  }

  element service {
    style {
      color red
    }
  }

  element database {
    style {
      shape cylinder
    }
  }

  element topic {
    style {
      shape queue
    }
  }
}

model {
  administrator = user 'Adminisztrátor'
  zeu = user 'Zamunda Energetikai Ügynökség'
  suppliers = user 'Energiatermelők'
  consumers = user 'Nagyfogyasztók'
  otherUsers = user 'Egyéb erőművek'

  zpower = system 'Z-Power' {

    // Adatbázisok 
    // Mivel alapvetően többféle adatot kell eltárolni, amik esetleg nem is kapcsolódnak egymáshoz, így ezeket az annak megfelelő adatb típusban lesz eltárolva. 
    // - A nagy mennyiségű termelési adat egy TimesaledDB-be kerül, mert a "sima" db lelassul ilyen szinten nagy mennyiség alatt.
    // - A felhasználóhoz, szerepekhez kapcsolódó adatoknak viszont megfelelő a "sima" db is, egy timescaleddb elég overkill neki.
    // - Valamint mivel van lehetőség fájlok exportjára is, egy "sima db" ezek tárolására sem megfelelő. Így erre is szükség van egy saját file storage-ra.
    // Ezen okok (valamint a hirtelen megnőtt ábra könnyebb áttekinthetősége) miatt szétszedtük az adatbázisokat az általunk vélt, célnak megfelelő eszközökre.
    timeseriesDb = database 'Time-Series DB' {
      description 'Termelési adatok tartós tárolása (TimescaleDB / InfluxDB). Replikált.'
    }

    metadataDb = database 'Metadata DB' {
      description 'Termelők, felhasználók, szerepkörök, konfiguráció (PostgreSQL).'
    }

    exportStorage = database 'Public Export Storage' {
      description 'Nyilvánosan elérhető CSV/JSON export fájlok (object storage).'
    }


    // Event-Driven oldal: 
    // - Adatbefogadás 
    // - Feldolgozás
    // Ez az oldal fogadja és dolgozza fel a termelők adatait. Azért választottuk az EDA-t, mert a termelők nem tudják újraküldeni az adatokat, tehát egyetlen esemény sem veszhet el.
    // A működés lényege: minden beérkező adatot azonnal egy üzenetsorba (topic) teszünk, és így a tényleges feldolgozás már biztonságos pufferből történik.
    // - A restGateway és az mqttBroker a két belépési pont. Azért kell mindkettő, mert a termelők kétféle protokollon küldhetnek (REST és MQTT - REQ-01), de mindkettő ugyanabba a topicba pakol, így a mögöttes pipeline közös marad.
    // - Az ingestionTopic a "biztonsági háló": amint egy adat ideér, már nem veszhet el, akkor sem, ha a feldolgozó szolgáltatások épp leállnak.
    // - A normalizer a schemaRegistry segítségével (50+ különböző séma - REQ-02) egységes belső formátumra alakítja az adatokat, majd a normalizedTopic-ra publikálja őket.
    // - A normalizedTopic-ra több fogyasztó is iratkozhat párhuzamosan. Eredetileg 1 volt, de néhány iteráció után kiderült, hogy több feladatot is el kellene látnia, így a szétszedés mellett döntöttünk. Ezekből lett kettő, a persistenceWorker és a faultDetector. Viszont abban az esetben, ha kell egy új fogyasztó, a meglévő rendszer módosítása nélkül hozzáadható.
    // - A persistenceWorker csak annyit csinál, hogy a normalizált adatot beírja a time-series db-be. 
    // - A faultDetector figyeli a termelők küldési mintázatát és értékeit, és ha baj van, szól a notificationService-nek (REQ-07, REQ-08, REQ-10).
    restGateway = service 'REST API Gateway' {
      description 'HTTPS/REST végpont termelői adatoknak (REQ-01). Autentikáció, gzip, validáció.'
    }

    mqttBroker = service 'MQTT Broker' {
      description 'MQTT broker IoT eszközöknek (REQ-01). Könnyűsúlyú, alacsony sávszélességhez.'
    }

    ingestionTopic = topic 'Raw Ingestion Topic' {
      description 'Nyers termelői események üzenetsora. Pufferelés, tartós tárolás azonnal.'
    }

    schemaRegistry = service 'Schema Registry' {
      description '50+ termelői séma regisztere, verziózva (REQ-02). Konfigurálhatóan bővíthető.'
    }

    normalizer = service 'Normalizer Service' {
      description 'Séma-alapú validáció és egységes belső formátumra hozás (REQ-03, REQ-05).'
    }

    normalizedTopic = topic 'Normalized Data Topic' {
      description 'Normalizált termelési események. Több fogyasztó olvassa párhuzamosan.'
    }

    faultDetector = service 'Fault Detection Service' {
      description 'Adatküldési mintázat és termelési érték alapú üzemzavar-detekció (REQ-07, REQ-08).'
    }

    notificationService = service 'Notification Service' {
      description 'E-mail és webhook riasztások küldése üzemzavarok esetén (REQ-10).'
    }

    persistenceWorker = service 'Persistence Worker' {
      description 'Normalizált adatok tartós tárolásra írása az idősor-adatbázisba.'
    }


    // Microkernel oldal: 
    // - Megjelenítés
    // - Analitika
    // - Export
    // Ez az oldal foglalkozik azzal, hogy a már letárolt adatokat a felhasználók és a külső rendszerek felé kiszolgálja. Itt már nem az adatvesztés-mentesség a fő szempont (mivel az adat már biztonságban van a db-ben), hanem a bővíthetőség és a költséghatékonyság - ezért esett a választás a Microkernelre.
    // A működés lényege: van egy központi mag (microkernelCore), és köré plugin-ekként csatlakoznak a különböző funkciók. Minden plugin önálló, külön-külön fejleszthető, deployolható és cserélhető, anélkül, hogy a többit érintené.
    // - A webApp a felhasználók belépési pontja a böngészőben. Csak a microkernelCore-ral beszél, a pluginek létezéséről nem is kell tudnia.
    // - A microkernelCore maga a "mag": ő intézi a bejelentkezést, a jogosultságokat (RBAC) és azt, hogy melyik kérés melyik pluginhez menjen. Ezen iteráltunk néhányat, de végül maradt a mag feladata minden ezen pontok közül, mert "központi" elemeknek tűnnek. A metadataDb-t is ő kezeli, mert a felhasználói/jogosultsági adatok ehhez a maghoz tartoznak.
    // - A négy plugin (realtime, analytics, export, forecast) mind egy-egy különálló funkciót valósít meg. Pont ez a lényege a microkernelnek, mindegyik extra fukció külön, önállóan létezik, saját függőségekkel, stb.
    // - Új funkció hozzáadásához elég egy új plugint írni és regisztrálni a magban, a meglévők változtatlanul maradnak.
    // - A dispatcherApi néhány iterációval később szándékosan nem plugin maradt, hanem dedikált, külön szolgáltatás. Méghozzá azért, mert a diszpécserközpont egy kritikus külső fogyasztó, így fontos a "magtól" való izolálás, hibatűrés probléma esetén. Nem tartjuk opciónak, hogy ez problémába ütközzön, ha a web/core meghal. Valamint az as-ünkben is találtunk egy pontot erre kapcsolódóan, hogy szükséges lehet egy külön réteg neki.
    webApp = frontend 'Web Dashboard' {
      description 'Reszponzív, progresszív betöltésű webes felület (REQ-12, REQ-15).'
    }

    microkernelCore = service 'Microkernel Core / API Gateway' {
      description 'Belső magrendszer: plugin-regisztráció, routing, autentikáció, RBAC.'
    }

    realtimePlugin = service 'Realtime Dashboard Plugin' {
      description 'Valós idejű termelési és üzemzavar adatok (REQ-12, REQ-13, REQ-14).'
    }

    analyticsPlugin = service 'Historical Analytics Plugin' {
      description 'Historikus lekérdezések, aggregációk, idősoros grafikonok (REQ-17..REQ-20).'
    }

    exportPlugin = service 'Export Plugin' {
      description 'Időzített CSV/JSON export generálás (REQ-21..REQ-24).'
    }

    forecastPlugin = service 'Forecasting Plugin' {
      description 'ML-alapú 24/72 órás termelési előrejelzés (REQ-25..REQ-29).'
    }

    dispatcherApi = service 'Dispatcher Integration API' {
      description 'Dedikált API-réteg a diszpécserközpontnak. Verziózott, dokumentált sémák.'
    }


    // Container szintű, belső kapcsolatok
    restGateway -> ingestionTopic 'publish raw event'
    mqttBroker -> ingestionTopic 'publish raw event'

    ingestionTopic -> normalizer 'consume'
    normalizer -> schemaRegistry 'fetch schema'
    normalizer -> normalizedTopic 'publish normalized event'

    normalizedTopic -> persistenceWorker 'consume'
    normalizedTopic -> faultDetector 'consume'
    persistenceWorker -> timeseriesDb 'write'
    faultDetector -> timeseriesDb 'read history'
    faultDetector -> notificationService 'trigger alert'

    webApp -> microkernelCore 'HTTPS/REST'
    microkernelCore -> metadataDb 'read/write'
    microkernelCore -> realtimePlugin 'invoke'
    microkernelCore -> analyticsPlugin 'invoke'
    microkernelCore -> exportPlugin 'invoke'
    microkernelCore -> forecastPlugin 'invoke'

    realtimePlugin -> timeseriesDb 'read recent'
    realtimePlugin -> faultDetector 'subscribe to alerts'
    analyticsPlugin -> timeseriesDb 'read historical'
    exportPlugin -> timeseriesDb 'read'
    exportPlugin -> exportStorage 'write files'
    forecastPlugin -> timeseriesDb 'read history'

    dispatcherApi -> timeseriesDb 'read aggregated'
    dispatcherApi -> forecastPlugin 'read forecast'
  }

  weatherApi = externalSystem 'Weather API'
  ggApi = externalSystem 'GreenGrant API'
  countryElectricNetwork = externalSystem 'Országos villamosenergia-hálózat diszpécserrendszere'


  // Context szintű, külső kapcsolatok
  administrator -> zpower 'uses'
  zeu -> zpower 'uses'
  suppliers -> zpower 'uses'
  consumers -> zpower 'uses'
  otherUsers -> zpower 'uses'
  weatherApi -> zpower 'Provides weather info'
  ggApi -> zpower 'Provides GreenGrant info'
  countryElectricNetwork -> zpower 'data transfer'


  // Context -> Container átmeneti kapcsolatok
  suppliers -> zpower.restGateway 'REST API adatküldés'
  suppliers -> zpower.mqttBroker 'MQTT publish'

  administrator -> zpower.webApp 'admin felület'
  zeu -> zpower.webApp 'monitorozás, analitika'
  consumers -> zpower.webApp 'dashboard megtekintés'
  otherUsers -> zpower.webApp 'dashboard megtekintés'
  consumers -> zpower.exportStorage 'letöltés (HTTPS)'

  weatherApi -> zpower.forecastPlugin 'időjárás adatok'
  ggApi -> zpower.microkernelCore 'új termelők szinkronizálása'
  countryElectricNetwork -> zpower.dispatcherApi 'valós idejű lekérdezés'
}

views {
  view systemContext {
    title 'System Context'
    include *
  }

  view containerView of zpower {
    title 'Container Diagram - Z-Power'
    include *
  }
}
