---
title: "Las props de React y useContext"
description: "Pasar props entre componentes anidados y cuándo usar el hook useContext"
---

Pasar props parece sencillo, pero se vuelve más difícil de gestionar a medida que crece una aplicación.

Como explica la [documentación de React](https://reactjs.org/docs/components-and-props.html), las props son propiedades que pasas a los componentes. Pueden ser valores escalares, objetos o incluso componentes.

En este ejemplo de TypeScript, `name` es una prop de tipo `string`. Puedes leer más sobre las props tipadas en mi [artículo anterior](/blog/why-use-typescript-for-react-projects).

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

### Cuando las cosas se complican

Pasar props funciona bien con componentes sencillos. Pero a medida que anidas más componentes, puedes acabar con algo así:

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

Aquí, `Friend` podría necesitar `screenSize` para mostrar menos elementos en una pantalla pequeña.

Estos tres componentes se pasan props que solo usan uno o dos de ellos. En un proyecto grande, es fácil acabar con muchos componentes que pasan datos que no necesitan.

Veamos la alternativa con el [hook](https://reactjs.org/docs/hooks-state.html#whats-a-hook) `useContext`:

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

Eliminar las props que no se usan facilita la lectura y la modificación del código.

Aquí declaramos un contexto para `user` y otro para `screenSize`. Ambos componentes hijos usan `user`, aunque lo necesiten por motivos distintos. Podemos anidarlos dentro de componentes que no usan `user` sin pasarlo por cada nivel. Solo `Friend` usa `screenSize`, por lo que los demás componentes no tienen que ocuparse de él.

### Nota final

Los contextos están muy bien, pero tampoco abuses de ellos. Úsalos como una herramienta más para estructurar el código y separar responsabilidades, pero utiliza props normales siempre que tenga sentido, como para pasar los datos que un componente quiere mostrar o algo que comparten el padre y el hijo.

### Para saber más

* [https://reactjs.org/docs/hooks-reference.html#usecontext](https://reactjs.org/docs/hooks-reference.html#usecontext)
* [https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react](https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react)
