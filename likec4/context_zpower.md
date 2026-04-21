```
specification {
  element  user {
    style { 
          shape person
          color green
        }
  }

  element system 

  element  externalSystem {
    style {
      color : amber
    }
  }

  element frontend {
    style {
      shape browser
    }
  }

  element  service {
    style {
      color  red 
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

  zpower = system 'Z-Power'  {
  }

  weatherApi= externalSystem 'Weather API'
  ggApi= externalSystem 'GreenGrant API'
  countryElectricNetwork = externalSystem  'Országos villamosenergia-hálózat diszpécserrendszere'

  administrator -> zpower 'uses'
  zeu -> zpower 'uses'
  suppliers -> zpower 'uses'
  consumers -> zpower 'uses'
  otherUsers -> zpower 'uses'
  weatherApi -> zpower 'Provides weather info'
  ggApi -> zpower 'Provides GreenGrant info'
  countryElectricNetwork -> zpower 'data transfer'

}

views {
  view  systemContext  {
    title 'System Context'
    include  *
  }
}
```