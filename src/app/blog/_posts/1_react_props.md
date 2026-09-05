---
title: React props and useContext
description: Passing props through nested components and when to use the useContext hook
slug: react-props-and-use-context
tags: ["react", "frontend"]
date: 2019-11-28
---

Passing props seems simple, but it gets harder to manage as an application grows.

As the [React documentation](https://reactjs.org/docs/components-and-props.html) explains, props are properties you pass
to components. They can be scalar values, objects, or even components.

In this TypeScript example, `name` is a prop with the `string` type. You can read more about typed props in my
[previous post](/blog/why-use-typescript-for-react-projects).

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

### When things get messy

Passing props works well for simple components. As you nest more components, though, you can end up with something like this:

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

Here, `Friend` might need `screenSize` to display fewer elements on a small screen.

These three components pass along props that only one or two of them use. In a large codebase, it's easy to end up
with many components passing data they don't need themselves.

Let's see the alternative using the `useContext` [hook](https://reactjs.org/docs/hooks-state.html#whats-a-hook):

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

Removing unused props makes the code easier to read and change.

Here, we declare one context for `user` and another for `screenSize`. Both child components use `user`, even if they
need it for different reasons. We can nest them inside components that don't use `user` without passing it through
each level. Only `Friend` uses `screenSize`, so the other components don't need to handle it.

### Final note

Contexts are great, but don't overuse them either. Have them as another tool to structure your code and separate
concerns, but use regular props for everything that makes sense, like passing the data a component wants to render, or 
something that both parent and child components share.

### Further reading

* [https://reactjs.org/docs/hooks-reference.html#usecontext](https://reactjs.org/docs/hooks-reference.html#usecontext)
* [https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react](https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react)
