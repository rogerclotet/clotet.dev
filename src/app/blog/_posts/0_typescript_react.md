---
title: Why you should use TypeScript for your React projects
description: Why I use TypeScript with React and how typed props help
slug: why-use-typescript-for-react-projects
tags: ["typescript", "react", "javascript", "frontend"]
date: 2019-11-22
---

[TypeScript](https://www.typescriptlang.org) is a typed superset of JavaScript created by Microsoft. It compiles
into JavaScript. You don't need to use it in all your scripts, which means you can migrate your codebase as slowly as
you want, or simply start writing your new files using TypeScript.

I think it's fair to say TypeScript has gained a lot of momentum in the last few years, but it's still not the default
for many frameworks and libraries, even though most of the community is adopting it.

Why use TypeScript when it often means writing more code? Take a look at this example:

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

This simple JavaScript component illustrates the point. The same component could be
written in TypeScript as follows:

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

Both components do the same thing, but the TypeScript version defines the types of the `name` and `age` props.

The issue with the JavaScript one is that it would accept all of these:

```jsx
<Greeting name="Roger" /> // output "Hello, my name is Roger and I'm  years old"
<Greeting age={30} /> // output: "Hello, my name is  and I'm 30 years old"
<Greeting /> // output: "Hello, my name is  and I'm  years old"
```

Not to mention other consequences when using more complex types like objects or functions, which can lead to crashes or
errors/warnings in the developer console.

TypeScript tells you which props a component needs, which are optional, and what types they accept. It also checks
regular functions. Editors can use that information to catch mistakes and help you refactor components and functions.

It may not seem necessary for small components like this, but when your codebase has tens, hundreds, or thousands of
interrelated components those checks become much more useful.

### Quick note about PropTypes

The `prop-types` library offers runtime validation for React props in JavaScript. You can
read more about that [here](https://reactjs.org/docs/typechecking-with-proptypes.html). It only verifies props, not other variables used in non-component functions.

In my opinion, it was a good solution when TypeScript wasn't mature enough, but nowadays it's not worth it.

### Further reading

* [https://reactjs.org/docs/static-type-checking.html#typescript](https://reactjs.org/docs/static-type-checking.html#typescript)
* [https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project](https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project)
* [https://nextjs.org/docs#typescript](https://nextjs.org/docs#typescript)
* [https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/](https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/)
