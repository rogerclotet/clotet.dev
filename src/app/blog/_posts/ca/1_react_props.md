---
title: "Les props de React i useContext"
description: "Passar props entre components imbricats i quan fer servir el hook useContext"
---

Passar props sembla senzill, però es fa més difícil de gestionar a mesura que una aplicació creix.

Com explica la [documentació de React](https://reactjs.org/docs/components-and-props.html), les props són propietats que passes als components. Poden ser valors escalars, objectes o fins i tot components.

En aquest exemple de TypeScript, `name` és una prop de tipus `string`. Pots llegir més sobre les props tipades al meu [article anterior](/blog/why-use-typescript-for-react-projects).

```tsx
interface Props {
  name: string
}

const Hello = (props: Props) => {
  return <p>Hello, {props.name}!</p>
}

// You would call this component like this:
<Hello name="Roger" />
```

### Quan les coses es compliquen

Passar props funciona bé amb components senzills. Però a mesura que imbriques més components, pots acabar amb una cosa així:

```tsx
import React from 'react'

interface User { id: number, name: string }

const Page = (props: {user: User, friends: User[], screenSize: string}) => (
  <div>
    <h1>{props.user.name}'s friends</h1>
    <FriendList user={props.user} friends={props.friends} screenSize={props.screenSize} />
  </div>
)

const FriendList = (props: {user: User, friends: User[], screenSize: string}) => (
  <ul>
    {props.friends.filter(friend => friend.id !== props.user.id).map(friend => (
      <li key={friend.id}>
        <Friend user={friend} screenSize={props.screenSize} />
      </li>
    ))}
  </ul>
)

const [user1, user2, user3, user4] = [{id: 1, name: 'a'}, {id: 2, name: 'b'}, {id: 3, name: 'c'}, {id: 4, name: 'd'}]

<Page user={user1} friends={[user2, user3, user4]} screenSize="md" />
```

Aquí, `Friend` podria necessitar `screenSize` per mostrar menys elements en una pantalla petita.

Aquests tres components es passen props que només fan servir un o dos d'ells. En un projecte gran, és fàcil acabar amb molts components que passen dades que no necessiten.

Vegem l'alternativa amb el [hook](https://reactjs.org/docs/hooks-state.html#whats-a-hook) `useContext`:

```tsx
import React, {createContext, useContext} from 'react'

interface User { id: number, name: string }
const [user1, user2, user3, user4] = [{id: 1, name: 'a'}, {id: 2, name: 'b'}, {id: 3, name: 'c'}, {id: 4, name: 'd'}]

const UserContext = createContext<{user: User}>(user1)
const ScreenSizeContext = createContext<{screenSize: string}>('md')

const Page = (props: {friends: User[]}) => {
  const user = useContext(UserContext)
  return (
    <div>
      <h1>{user.name}'s friends</h1>
      <FriendList friends={props.friends} />
    </div>
  )
}

const FriendList = (props: {friends: User[]}) => {
  const user = useContext(UserContext)
  return (
    <ul>
      {props.friends.filter(friend => friend.id !== user.id).map(friend => (
        <li key={friend.id}>
          <Friend user={friend} />
        </li>
      ))}
    </ul>
  )
}

<Page friends={[user2, user3, user4]} />
```

Eliminar les props que no es fan servir facilita la lectura i la modificació del codi.

Aquí declarem un context per a `user` i un altre per a `screenSize`. Tots dos components fills fan servir `user`, encara que el necessitin per motius diferents. Els podem imbricar dins de components que no fan servir `user` sense passar-lo per cada nivell. Només `Friend` fa servir `screenSize`, de manera que els altres components no se n'han d'ocupar.

### Nota final

Els contextos van molt bé, però tampoc n'abusis. Fes-los servir com una eina més per estructurar el codi i separar responsabilitats, però utilitza props normals sempre que tingui sentit, com ara per passar les dades que un component vol mostrar o alguna cosa que comparteixen el pare i el fill.

### Per saber-ne més

* [https://reactjs.org/docs/hooks-reference.html#usecontext](https://reactjs.org/docs/hooks-reference.html#usecontext)
* [https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react](https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react)
