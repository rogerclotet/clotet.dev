---
title: "Por qué deberías usar TypeScript en tus proyectos de React"
description: "Por qué uso TypeScript con React y cómo ayudan las props tipadas"
---

[TypeScript](https://www.typescriptlang.org) es un superconjunto tipado de JavaScript creado por Microsoft. Se compila a JavaScript. No hace falta usarlo en todos los scripts, por lo que puedes migrar el código al ritmo que quieras o simplemente empezar a escribir los archivos nuevos con TypeScript.

Creo que se puede decir que TypeScript ha ganado mucha popularidad en los últimos años, pero aún no es la opción predeterminada de muchos frameworks y bibliotecas, aunque buena parte de la comunidad lo está adoptando.

¿Por qué usar TypeScript si a menudo implica escribir más código? Mira este ejemplo:

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

Este componente sencillo de JavaScript ilustra la idea. El mismo componente se podría escribir en TypeScript así:

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

Ambos componentes hacen lo mismo, pero la versión en TypeScript define los tipos de las props `name` y `age`.

El problema de la versión en JavaScript es que aceptaría todos estos casos:

```jsx
<Greeting name="Roger" /> // output "Hello, my name is Roger and I'm  years old"
<Greeting age={30} /> // output: "Hello, my name is  and I'm 30 years old"
<Greeting /> // output: "Hello, my name is  and I'm  years old"
```

Por no hablar de otras consecuencias al usar tipos más complejos, como objetos o funciones, que pueden provocar errores o avisos en la consola del desarrollador, o hacer que la aplicación deje de funcionar.

TypeScript te indica qué props necesita un componente, cuáles son opcionales y qué tipos aceptan. También comprueba las funciones normales. Los editores pueden usar esa información para detectar errores y ayudarte a refactorizar componentes y funciones.

Puede parecer innecesario en componentes pequeños como este, pero cuando el código tiene decenas, cientos o miles de componentes relacionados, estas comprobaciones son mucho más útiles.

### Una nota breve sobre PropTypes

La biblioteca `prop-types` ofrece validación en tiempo de ejecución de las props de React en JavaScript. Puedes leer más [aquí](https://reactjs.org/docs/typechecking-with-proptypes.html). Solo verifica las props, no las demás variables que se usan en funciones que no son componentes.

En mi opinión, era una buena solución cuando TypeScript aún no era lo bastante maduro, pero hoy en día no merece la pena.

### Para saber más

* [https://reactjs.org/docs/static-type-checking.html#typescript](https://reactjs.org/docs/static-type-checking.html#typescript)
* [https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project](https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project)
* [https://nextjs.org/docs#typescript](https://nextjs.org/docs#typescript)
* [https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/](https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/)
