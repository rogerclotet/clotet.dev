---
title: Close an Ionic Android app with back button
description:  A simple way of handling the back button in an Android app generated with Ionic React, using Capacitor
slug: close-ionic-android-app-back-button
tags: ["frontend", "ionic", "capacitor", "android", "react"]
date: 2020-02-20
---

[Ionic documentation](https://ionicframework.com/docs) is good, but it's not very extensive in some topics. One of them
is, for now, the [React integration](https://ionicframework.com/docs/react/) in mobile platforms.

In the case in point, handling Android's back button to close the app in a standard way. This issue doesn't affect iOS
at all, since iOS devices don't have a physical back button and multitasking and app management work in a very different
way.  

The normal way of interacting with apps in Android is something like this:

* You open an app and navigate to different pages
* Every time you press the back button: go back to the last visited page in an app navigation, until you reach the root
page -or at least the first screen loaded when the app was loaded
* You press back button again: either a toast message is displayed asking for a second back button press to confirm app
exit, or the app is closed directly

The default behaviour in Ionic React 5.0.0 is to navigate normally and using the back button to go back in
`window.history`, but the app is never closed using the back button, you have to use the home or multitasking button to
close it or switch applications.

I couldn't find a satisfactory answer on how to handle this using the React version of Ionic, even though I found many
articles for Angular (some links below). Let's walk through the solution I put together:

### Show me the code

If you use Ionic React with the [Capacitor Android integration](https://capacitor.ionicframework.com/docs/android/), you
have access to some APIs by default. One of them is the [App API](https://capacitor.ionicframework.com/docs/apis/app).
You can use it to add listeners to some events, like `backButton`, that triggers a handler when the physical back button
is pressed. You can also exit the app, which are the two tools we will need.

In my case, I will want users to go back to a single initial page in my Ionic app, so I only need to handle the back
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
app only when we are in that page, we should remove the listener when we leave the view. That's how we can do that:

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

We store the listener handle in the reference`backButtonListenerHandle` when we register it on entering view, and when
we leave we remove it in case it was set. That allows Ionic to handle back buttons going back in history and achieving
our desired behaviour.

In case we have a modal or a different behaviour that requires only exiting app based on a condition, we need to add and
remove the listener conditionally when that state changes. For instance:

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

I hope this helps!

### Further reading

* [https://capacitor.ionicframework.com/docs/apis/app#method-addListener-3](https://capacitor.ionicframework.com/docs/apis/app#method-addListener-3)
* [https://capacitor.ionicframework.com/docs/apis/app#method-exitApp-0](https://capacitor.ionicframework.com/docs/apis/app#method-exitApp-0)
* [https://capacitor.ionicframework.com/docs/getting-started/with-ionic/](https://capacitor.ionicframework.com/docs/getting-started/with-ionic/)
* [https://stackoverflow.com/questions/55072219/how-to-exit-ionic-4-app-using-device-back-button](https://stackoverflow.com/questions/55072219/how-to-exit-ionic-4-app-using-device-back-button) (for Angular)
* [https://pointdeveloper.com/ionic-double-tap-back-button-exit/](https://pointdeveloper.com/ionic-double-tap-back-button-exit/) (for Angular)
