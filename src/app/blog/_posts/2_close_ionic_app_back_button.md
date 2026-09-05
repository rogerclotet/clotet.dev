---
title: Close an Ionic Android app with the back button
description: Handling the back button in an Android app generated with Ionic React, using Capacitor
slug: close-ionic-android-app-back-button
tags: ["frontend", "ionic", "capacitor", "android", "react"]
date: 2020-02-20
---

The [Ionic documentation](https://ionicframework.com/docs) is helpful, but some topics need more detail. One of them
is, for now, the [React integration](https://ionicframework.com/docs/react/) on mobile platforms.

One example is handling Android's back button to close the app. This issue doesn't affect iOS
at all, since iOS devices don't have a physical back button and multitasking and app management work in a very different
way.  

The normal way of interacting with apps on Android is something like this:

* You open an app and navigate to different pages
* Press the back button to return to the previous page, until you reach the first screen
* Press it again to close the app, sometimes after a toast message asks you to press once more to confirm

The default behaviour in Ionic React 5.0.0 uses the back button to navigate through
`window.history`, but never closes the app. You have to use the home or multitasking button to leave it or switch apps.

I couldn't find a satisfactory answer on how to handle this using the React version of Ionic, even though I found many
articles for Angular (some links below). Let's walk through the solution I put together:

### Show me the code

If you use Ionic React with the [Capacitor Android integration](https://capacitor.ionicframework.com/docs/android/), you
have access to some APIs by default. One of them is the [App API](https://capacitor.ionicframework.com/docs/apis/app).
It lets you listen for events such as `backButton` and exit the app. Those are the two tools we need.

In my case, I want users to go back to a single initial page in my Ionic app, so I only need to handle the back
button event there.

The naive approach:

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

This will work in an app with only one page, but most apps will have some kind of navigation. Since we want to exit the
app only when we are in that page, we should remove the listener when we leave the view. Here's how:

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

We store the listener handle in `backButtonListenerHandle` when we enter the view, then remove the listener when we
leave. Ionic can then use the back button to navigate through history on other pages.

If a modal or another condition should prevent the app from closing, we can add and remove the listener as that state
changes. For example:

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

### Further reading

* [https://capacitor.ionicframework.com/docs/apis/app#method-addListener-3](https://capacitor.ionicframework.com/docs/apis/app#method-addListener-3)
* [https://capacitor.ionicframework.com/docs/apis/app#method-exitApp-0](https://capacitor.ionicframework.com/docs/apis/app#method-exitApp-0)
* [https://capacitor.ionicframework.com/docs/getting-started/with-ionic/](https://capacitor.ionicframework.com/docs/getting-started/with-ionic/)
* [https://stackoverflow.com/questions/55072219/how-to-exit-ionic-4-app-using-device-back-button](https://stackoverflow.com/questions/55072219/how-to-exit-ionic-4-app-using-device-back-button) (for Angular)
* [https://pointdeveloper.com/ionic-double-tap-back-button-exit/](https://pointdeveloper.com/ionic-double-tap-back-button-exit/) (for Angular)
