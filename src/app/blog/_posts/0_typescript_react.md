---
title: Why you should use TypeScript for your React projects
description: Opinion about TypeScript vs JavaScript usage and reasons why you should use typings
slug: why-use-typescript-for-react-projects
tags: ["typescript", "react", "javascript", "frontend"]
date: 2019-11-22
---

[TypesScript](https://www.typescriptlang.org) is a typed JavaScript superset created by Microsoft, that gets compiled
into JavaScript. You don't need to use it in all your scripts, which means you can migrate your codebase as slowly as
you want, or simply start writing your new files using TypeScript.

I think it's fair to say TypeScript has gained a lot of momentum in the last few years, but it's still not the default
for many frameworks and libraries, even though most of the community is adopting it.

Let's dive into the main point: why should you use TypeScript, taking into account that most of the time that means
having more code? Take a look at the following example:

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

This is a really simple component in JavaScript, but it will be enough to make my point. The same component could be
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

Both components do exactly the same, but in TypeScript we have typed `props`, with both `name` and `age` defined and
typed.

The issue with the JavaScript one is that it would accept all of these:

```jsx
<Greeting name="Roger" /> // output "Hello, my name is Roger and I'm  years old"
<Greeting age={30} /> // output: "Hello, my name is  and I'm 30 years old"
<Greeting /> // output: "Hello, my name is  and I'm  years old"
```

Not to mention other consequences when using more complex types like objects or functions, which can lead to crashes or
errors/warnings in the developer console.

Typescript will help you know much better which props you need to pass to a component, which ones are optional, and
last but not least, the types of these props. All of these, added to the extra type safety on regular functions, will
make your development process much faster and more reliable. IDEs understand it better than plain JavaScript in most
situation and can help when refactoring components or functions.

It may not seem necessary for small components like this, but when your codebase has tens, hundreds, or thousands of
interrelated components it is truly priceless.

### Quick note about PropTypes

An alternative to have some kind of type validation in React props using JavaScript is the `prop-types` library. You can
read more about that [here](https://reactjs.org/docs/typechecking-with-proptypes.html). The problem with that is that
only verifies props, not other variables used in non-component functions.

In my opinion, it was a good solution when TypeScript wasn't mature enough, but nowadays it's not worth it.

### Further reading

* [https://reactjs.org/docs/static-type-checking.html#typescript](https://reactjs.org/docs/static-type-checking.html#typescript)
* [https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project](https://reactjs.org/docs/static-type-checking.html#adding-typescript-to-a-project)
* [https://nextjs.org/docs#typescript](https://nextjs.org/docs#typescript)
* [https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/](https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/)
