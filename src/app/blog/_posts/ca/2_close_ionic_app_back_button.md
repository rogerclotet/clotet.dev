---
title: "Tancar una aplicació Android d'Ionic amb el botó d'enrere"
description: "Gestionar el botó d'enrere en una aplicació Android creada amb Ionic React i Capacitor"
---

La [documentació d'Ionic](https://ionicframework.com/docs) és útil, però alguns temes necessiten més detall. Un d'ells és, de moment, la [integració amb React](https://ionicframework.com/docs/react/) a les plataformes mòbils.

Un exemple és gestionar el botó d'enrere d'Android per tancar l'aplicació. Aquest problema no afecta iOS, ja que els dispositius iOS no tenen un botó físic d'enrere i la multitasca i la gestió d'aplicacions funcionen d'una manera molt diferent.

La manera habitual d'interactuar amb les aplicacions a Android és més o menys aquesta:

* Obres una aplicació i navegues per diferents pàgines.
* Prems el botó d'enrere per tornar a la pàgina anterior fins a arribar a la pantalla inicial.
* El tornes a prémer per tancar l'aplicació, de vegades després que un missatge et demani que el premis una altra vegada per confirmar-ho.

El comportament predeterminat d'Ionic React 5.0.0 fa servir el botó d'enrere per navegar per `window.history`, però no tanca mai l'aplicació. Has de fer servir el botó d'inici o el de multitasca per sortir-ne o canviar d'aplicació.

No vaig trobar cap resposta satisfactòria sobre com gestionar-ho amb la versió de React d'Ionic, tot i que vaig trobar molts articles per a Angular, alguns dels quals enllaço més avall. Vegem la solució que vaig preparar:

### Ensenya'm el codi

Si fas servir Ionic React amb la [integració de Capacitor per a Android](https://capacitor.ionicframework.com/docs/android/), tens accés a algunes API per defecte. Una és l'[API App](https://capacitor.ionicframework.com/docs/apis/app). Permet escoltar esdeveniments com `backButton` i sortir de l'aplicació. Són les dues eines que necessitem.

En el meu cas, vull que els usuaris tornin a una única pàgina inicial de l'aplicació Ionic, així que només he de gestionar l'esdeveniment del botó d'enrere allà.

La primera aproximació:

```typescript
import React from 'react'
import { useIonViewDidEnter } from '@ionic/react'
import { Plugins } from '@capacitor/core'

const Home = () => {
  useIonViewDidEnter(() => {
    Plugins.App.addListener('backButton', Plugins.App.exitApp)
  })

  return <div>Content</div>
}
```

Això funciona en una aplicació amb una sola pàgina, però la majoria tenen algun tipus de navegació. Com que només volem sortir de l'aplicació quan som en aquella pàgina, hauríem d'eliminar l'escoltador quan abandonem la vista. Així:

```typescript
import React, { useRef } from 'react'
import { useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react'
import { PluginListenerHandle, Plugins } from '@capacitor/core'

const Home = () => {
  const backButtonListenerHandle = useRef<PluginListenerHandle>()
  
  useIonViewDidEnter(() => {
    backButtonListenerHandle.current = Plugins.App.addListener(
      'backButton',
      Plugins.App.exitApp
    )
  })
  
  useIonViewDidLeave(() => {
    if (backButtonListenerHandle.current) {
      backButtonListenerHandle.current.remove()
      backButtonListenerHandle.current = undefined
    }
  })

  return <div>Content</div>
}
```

Desem la referència de l'escoltador a `backButtonListenerHandle` quan entrem a la vista i l'eliminem quan en sortim. Així, Ionic pot fer servir el botó d'enrere per navegar per l'historial a les altres pàgines.

Si un diàleg modal o una altra condició ha d'impedir que l'aplicació es tanqui, podem afegir i eliminar l'escoltador quan canviï aquest estat. Per exemple:

```typescript
import React, { useEffect, useRef, useState } from 'react'
import { useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react'
import { PluginListenerHandle, Plugins } from '@capacitor/core'

const Home = () => {
  const [showModal, setShowModal] = useState(false)
  const backButtonListenerHandle = useRef<PluginListenerHandle>()
  
  const addBackButtonListener = () => {
    backButtonListenerHandle.current = Plugins.App.addListener(
      'backButton',
      Plugins.App.exitApp
    )
  }

  const removeBackButtonListener = () => {
    if (backButtonListenerHandle.current) {
      backButtonListenerHandle.current.remove()
      backButtonListenerHandle.current = undefined
    }
  }

  useIonViewDidEnter(addBackButtonListener)
  useIonViewDidLeave(removeBackButtonListener)

  useEffect(() => {
    if (showModal) {
      removeBackButtonListener()
    } else {
      addBackButtonListener()
    }
  }, [showModal])
}
```

### Per saber-ne més

* [https://capacitor.ionicframework.com/docs/apis/app#method-addListener-3](https://capacitor.ionicframework.com/docs/apis/app#method-addListener-3)
* [https://capacitor.ionicframework.com/docs/apis/app#method-exitApp-0](https://capacitor.ionicframework.com/docs/apis/app#method-exitApp-0)
* [https://capacitor.ionicframework.com/docs/getting-started/with-ionic/](https://capacitor.ionicframework.com/docs/getting-started/with-ionic/)
* [https://stackoverflow.com/questions/55072219/how-to-exit-ionic-4-app-using-device-back-button](https://stackoverflow.com/questions/55072219/how-to-exit-ionic-4-app-using-device-back-button) (per a Angular)
* [https://pointdeveloper.com/ionic-double-tap-back-button-exit/](https://pointdeveloper.com/ionic-double-tap-back-button-exit/) (per a Angular)
