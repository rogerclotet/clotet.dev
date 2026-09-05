---
title: "Per què hauries de fer servir TypeScript als teus projectes de React"
description: "Per què faig servir TypeScript amb React i com ajuden les props tipades"
---

[TypeScript](https://www.typescriptlang.org) és un superconjunt tipat de JavaScript creat per Microsoft. Es compila a JavaScript. No cal fer-lo servir a tots els scripts, de manera que pots migrar el codi al ritme que vulguis o simplement començar a escriure els fitxers nous amb TypeScript.

Crec que es pot dir que TypeScript ha guanyat molta popularitat els últims anys, però encara no és l'opció predeterminada de molts frameworks i biblioteques, tot i que bona part de la comunitat l'està adoptant.

Per què fer servir TypeScript si sovint implica escriure més codi? Mira aquest exemple:

```jsx
import React from 'react' 
import { createRoot } from 'react-dom/client'

const Greeting = (props) => {
  return (
    <p>Hello, my name is {props.name} and I'm {props.age} years old.</p>
  )
}

const container = document.getElementById('example')
const root = createRoot(container)
root.render(<Greeting name="Roger" age={30} />)
```

Aquest component senzill de JavaScript il·lustra la idea. El mateix component es podria escriure en TypeScript així:

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'

interface Props {
  name: string
  age: number
}

const Greeting = (props: Props) => {
  return (
    <p>Hello, my name is {props.name} and I'm {props.age} years old.</p>
  )
}

const container = document.getElementById('example')
const root = createRoot(container)
root.render(<Greeting name="Roger" age={30} />)
```

Tots dos components fan el mateix, però la versió en TypeScript defineix els tipus de les props `name` i `age`.

El problema de la versió en JavaScript és que acceptaria tots aquests casos:

```jsx
<Greeting name="Roger" /> // output "Hello, my name is Roger and I'm  years old"
<Greeting age={30} /> // output: "Hello, my name is  and I'm 30 years old"
<Greeting /> // output: "Hello, my name is  and I'm  years old"
```

Per no parlar d'altres conseqüències quan fem servir tipus més complexos, com objectes o funcions, que poden provocar errors o avisos a la consola del desenvolupador, o fer que l'aplicació deixi de funcionar.

TypeScript t'indica quines props necessita un component, quines són opcionals i quins tipus accepten. També comprova les funcions normals. Els editors poden fer servir aquesta informació per detectar errors i ajudar-te a refactoritzar components i funcions.

Pot semblar innecessari en components petits com aquest, però quan el codi té desenes, centenars o milers de components relacionats, aquestes comprovacions són molt més útils.

### Una nota breu sobre PropTypes

La biblioteca `prop-types` ofereix validació en temps d'execució de les props de React en JavaScript. En pots llegir més [aquí](https://reactjs.org/docs/typechecking-with-proptypes.html). Només verifica les props, no les altres variables que es fan servir en funcions que no són components.

Al meu parer, era una bona solució quan TypeScript encara no era prou madur, però avui dia no val la pena.

### Per saber-ne més

* [https://reactjs.org/docs/static-type-checking.html#typescript](https://reactjs.org/docs/static-type-checking.html#typescript)
* [https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project](https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project)
* [https://nextjs.org/docs#typescript](https://nextjs.org/docs#typescript)
* [https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/](https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/)
