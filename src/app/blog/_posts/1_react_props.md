---
title: React props and useContext
description: Props usages and alternatives like the useContext hook when using nested components
slug: react-props-and-use-context
tags: ["react", "frontend"]
date: 2019-11-28
---

This seems such a simple topic but it's trickier than it sounds to get it right to allow your code to scale up to large
applications.

For a quick introductions, as you can read on the 
[React documentation](https://reactjs.org/docs/components-and-props.html), "props" are just properties you pass to your
components. They can be anything, from scalar values, to objects, to full components themselves.

In the following example, `name` is a prop with `string` type (to use types you must use TypeScript or `prop-types`, you
can read more in my [last post](/blog/why-use-typescript-for-react-projects).

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

For simple components that's really easy, you can use any props you need and you won't have any issues. When you start
composing more and more components though, you can end up with something like this:

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

This is just an example and you can imagine why `Friend` would need the screenSize, maybe we want to display fewer
elements if we are in a small screen.

If you take a look at the props we're using in those 3 components, we are passing around all props just to be used in 
one or two components, and this tends to happen a lot (and I mean a LOT) when you're working in a large codebase, if
you're not really careful.

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

As you can see, having less props you don't need makes the core much more readable and maintainable, lets you edit make
changes much quicker, and feels better in general.

You only need to declare the contexts you need -in this case one for `user` and one for `screenSize`. We're using `user` 
in both child components, but it can be for unrelated reasons, and we could have nested them inside other components who
wouldn't care about `user`. `screenSize` will be used from `Friend` and the other components don't need to know if that
component uses it. It's not their responsibility.

### Final note

Contexts are great, but don't overuse them either. Have them as another tool to structure your code and separate
concerns, but use regular props for everything that makes sense, like passing the data a component wants to render, or 
something that both parent and children components share.

### Further reading

* [https://reactjs.org/docs/hooks-reference.html#usecontext](https://reactjs.org/docs/hooks-reference.html#usecontext)
* [https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react](https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react)
