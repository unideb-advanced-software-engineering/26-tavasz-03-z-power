```
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

  element multipleInstanceService {
    style {
      color red
      multiple: true
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

  element objectStorage {
    style {
      shape bucket
    }
  }

   element subsystem
}

model {
  administrator = user 'Adminisztrátor'
  zeu = user 'Zamunda Energetikai Ügynökség'
  suppliers = user 'Energiatermelők'
  consumers = user 'Nagyfogyasztók'
  otherUsers = user 'Egyéb erőművek'
  countryElectricNetwork = user 'Országos villamosenergia-hálózat diszpécserrendszere'
  
  weatherApi = externalSystem 'Weather API'
  ggApi = externalSystem 'GreenGrant API'

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

    mainDb = database 'Main DB' {
      description 'Termelők, felhasználók, szerepkörök, konfiguráció (PostgreSQL).'
    }

    exportStorage = objectStorage 'Public Export Storage' {
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
    
    eda_subsystem = subsystem 'Event-Driven Subsystem'{
      
        description 'Adatbefogadás, feldolgozás'

        restGateway = multipleInstanceService 'REST API Gateway' {
          description 'HTTPS/REST végpont termelői adatoknak (REQ-01). Autentikáció, gzip, validáció.'

        }

        mqttBroker = multipleInstanceService 'MQTT Broker' {
          description 'MQTT broker IoT eszközöknek (REQ-01). Könnyűsúlyú, alacsony sávszélességhez.'
        }

        ingestionTopic = topic 'Raw Ingestion Topic' {
          description 'Nyers termelői események üzenetsora. Pufferelés, tartós tárolás azonnal.'
        }

        schemaRegistry = service 'Schema Registry' {
          description '50+ termelői séma regisztere, verziózva (REQ-02). Konfigurálhatóan bővíthető.'
        }

        normalizer = multipleInstanceService 'Normalizer Service' {
          description 'Séma-alapú validáció és egységes belső formátumra hozás (REQ-03, REQ-05).'
        }

        normalizedTopic = topic 'Normalized Data Topic' {
          description 'Normalizált termelési események. Több fogyasztó olvassa párhuzamosan.'
        }

        faultDetector = multipleInstanceService 'Fault Detection Service' {
          description 'Adatküldési mintázat és termelési érték alapú üzemzavar-detekció (REQ-07, REQ-08).'
        }

        notificationService = service 'Notification Service' {
          description 'E-mail és webhook riasztások küldése üzemzavarok esetén (REQ-10).'
        }

        persistenceWorker = multipleInstanceService 'Persistence Worker' {
          description 'Normalizált adatok tartós tárolásra írása az idősor-adatbázisba.'
        }

    }
    
    // Microkernel oldal: 
    // - Megjelenítés
    // - Analitika
    // - Export
    // Ez az oldal foglalkozik azzal, hogy a már letárolt adatokat a felhasználók és a külső rendszerek felé kiszolgálja. Itt már nem az adatvesztés-mentesség a fő szempont (mivel az adat már biztonságban van a db-ben), hanem a bővíthetőség és a költséghatékonyság - ezért esett a választás a Microkernelre.
    // A működés lényege: van egy központi mag (microkernelCore), és köré plugin-ekként csatlakoznak a különböző funkciók. A pluginek NEM önálló szolgáltatások — a core-on belül futnak betöltött modulokként. Emiatt a Container diagramon egyetlen dobozként jelennek meg; a belső plugin-struktúra Component szinten lenne látható.
    // - A webApp a felhasználók belépési pontja a böngészőben. Csak a microkernelCore-ral beszél.
    // - A microkernelCore maga a "mag": ő intézi a bejelentkezést, a jogosultságokat (RBAC), és ő tölti be a plugineket (realtime dashboard, historikus analitika, export, előrejelzés). Ezen iteráltunk néhányat, de végül maradt a mag feladata minden ezen pontok közül, mert "központi" elemeknek tűnnek. A mainDb-t is ő kezeli, mert a felhasználói/jogosultsági adatok ehhez a maghoz tartoznak.
    // - A négy plugin (realtime, analytics, export, forecast) a core-on belül él, mint betölthető modulok. Pont ez a lényege a microkernelnek: a plugineket runtime-ban lehet regisztrálni, cserélni, anélkül hogy a magot újra kellene deployolni. Pl. a forecast plugin ML modelljét frissíteni lehet a dashboard érintése nélkül.
    // - Új funkció hozzáadásához elég egy új plugint írni és regisztrálni a magban, a meglévők változatlanul maradnak.
    // - A dispatcherApi néhány iterációval később szándékosan NEM a core része, hanem dedikált, külön szolgáltatás. Méghozzá azért, mert a diszpécserközpont egy kritikus külső fogyasztó, így fontos a "magtól" való izolálás, hibatűrés probléma esetén. Nem tartjuk opciónak, hogy ez problémába ütközzön, ha a web/core meghal. Valamint az as-ünkben is találtunk egy pontot erre kapcsolódóan, hogy szükséges lehet egy külön réteg neki.
    
    microkernel_subsystem = subsystem  'Microkernel Subsystem' {
        
        description 'Adat megjelenítés, analitika, export'

        webApp = frontend 'Web Dashboard' {
          description 'Reszponzív, progresszív betöltésű webes felület (REQ-12, REQ-15).'
        }

        microkernelCore = service 'Microkernel Core' {
          description 'Központi mag pluginekkel: autentikáció, RBAC, routing. Pluginek: valós idejű dashboard (REQ-12..14), historikus analitika (REQ-17..20), export (REQ-21..24), előrejelzés (REQ-25..29).'
        }

        dispatcherApi = service 'Dispatcher Integration API' {
          description 'Dedikált API-réteg a diszpécserközpontnak. Verziózott, dokumentált sémák.'
        }

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
    faultDetector -> timeseriesDb 'read history / write detected faults'
    faultDetector -> notificationService 'trigger alert'

    webApp -> microkernelCore 'HTTPS/REST'
    microkernelCore -> mainDb 'read/write'
    microkernelCore -> timeseriesDb 'read (recent faults, historical, forecast)'
    microkernelCore -> exportStorage 'write export files'

    dispatcherApi -> timeseriesDb 'read aggregated'
    dispatcherApi -> microkernelCore 'read forecast'
  }

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

  weatherApi -> zpower.microkernelCore 'időjárás adatok'
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
    include  eda_subsystem.*
    include  microkernel_subsystem.*
  }
}

```