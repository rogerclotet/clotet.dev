---
title: "Cerrar una aplicación Android de Ionic con el botón de atrás"
description: "Gestionar el botón de atrás en una aplicación Android creada con Ionic React y Capacitor"
---

La [documentación de Ionic](https://ionicframework.com/docs) es útil, pero algunos temas necesitan más detalle. Uno de ellos es, por ahora, la [integración con React](https://ionicframework.com/docs/react/) en las plataformas móviles.

Un ejemplo es gestionar el botón de atrás de Android para cerrar la aplicación. Este problema no afecta a iOS, ya que los dispositivos iOS no tienen un botón físico de atrás y la multitarea y la gestión de aplicaciones funcionan de una manera muy distinta.

La forma habitual de interactuar con las aplicaciones en Android es más o menos esta:

* Abres una aplicación y navegas por distintas páginas.
* Pulsas el botón de atrás para volver a la página anterior hasta llegar a la pantalla inicial.
* Vuelves a pulsarlo para cerrar la aplicación, a veces después de que un mensaje te pida que lo pulses otra vez para confirmarlo.

El comportamiento predeterminado de Ionic React 5.0.0 usa el botón de atrás para navegar por `window.history`, pero nunca cierra la aplicación. Tienes que usar el botón de inicio o el de multitarea para salir o cambiar de aplicación.

No encontré ninguna respuesta satisfactoria sobre cómo gestionarlo con la versión de React de Ionic, aunque encontré muchos artículos para Angular, algunos de los cuales enlazo más abajo. Veamos la solución que preparé:

### Enséñame el código

Si usas Ionic React con la [integración de Capacitor para Android](https://capacitor.ionicframework.com/docs/android/), tienes acceso a algunas API por defecto. Una es la [API App](https://capacitor.ionicframework.com/docs/apis/app). Permite escuchar eventos como `backButton` y salir de la aplicación. Son las dos herramientas que necesitamos.

En mi caso, quiero que los usuarios vuelvan a una única página inicial de la aplicación Ionic, así que solo tengo que gestionar el evento del botón de atrás allí.

La primera aproximación:

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

Esto funciona en una aplicación con una sola página, pero la mayoría tienen algún tipo de navegación. Como solo queremos salir de la aplicación cuando estamos en esa página, deberíamos eliminar el listener al abandonar la vista. Así:

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

Guardamos la referencia del listener en `backButtonListenerHandle` al entrar en la vista y lo eliminamos al salir. Así, Ionic puede usar el botón de atrás para navegar por el historial en las demás páginas.

Si un diálogo modal u otra condición debe impedir que se cierre la aplicación, podemos añadir y eliminar el listener cuando cambie ese estado. Por ejemplo:

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

### Para saber más

* [https://capacitor.ionicframework.com/docs/apis/app#method-addListener-3](https://capacitor.ionicframework.com/docs/apis/app#method-addListener-3)
* [https://capacitor.ionicframework.com/docs/apis/app#method-exitApp-0](https://capacitor.ionicframework.com/docs/apis/app#method-exitApp-0)
* [https://capacitor.ionicframework.com/docs/getting-started/with-ionic/](https://capacitor.ionicframework.com/docs/getting-started/with-ionic/)
* [https://stackoverflow.com/questions/55072219/how-to-exit-ionic-4-app-using-device-back-button](https://stackoverflow.com/questions/55072219/how-to-exit-ionic-4-app-using-device-back-button) (para Angular)
* [https://pointdeveloper.com/ionic-double-tap-back-button-exit/](https://pointdeveloper.com/ionic-double-tap-back-button-exit/) (para Angular)
