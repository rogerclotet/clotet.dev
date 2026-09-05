---
title: Suspense in Next.js server components
description: Using Suspense to display loading states in Next.js server components
slug: suspense-nextjs-server-components
tags: ["react", "nextjs", "suspense", "frontend"]
date: 2024-06-21
---

I've been trying to understand how to use `Suspense` for data fetching since React 18. This example helped it click.

In the Next.js App Router you have two ways of displaying loading states in pages generated on the server:

- Adding a `loading.tsx` file next to `page.tsx`. This is the simpler way, and Next.js will automatically render it until the page is ready.
- Wrapping components in `Suspense` boundaries yourself. This takes more work, but lets you show a loading state for part of the page.

You can read a bit more about this in the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states).

### Example

This is useful when an async server component fetches data, for example from a database, and you want to show a loading state while it renders.

For this example, `SlowComponent` waits a random amount of time between zero and three seconds before rendering.

```tsx
import { setTimeout } from "timers/promises";

export default async function SlowComponent() {
  const timeToRender = Math.random() * 3000;
  await setTimeout(timeToRender);

  console.log(`Rendered after ${timeToRender.toFixed(0)}ms`);

  return (
    <div className="w-96 px-6 py-4 rounded-lg border-2 border-muted-foreground bg-muted">
      <h1 className="text-lg font-semibold mb-2">Slow component</h1>
      <p>Lorem ipsum dolor sit amet [...]</p>
    </div>
  );
}
```

Rendering 10 of these components in a page will result in waiting for almost 3 seconds most of the time, since we have to wait for the slowest component to finish rendering.

```text
Rendered after 162ms
Rendered after 545ms
...
Rendered after 2805ms
Rendered after 2911ms
```

If we add a suspense boundary around the slow components being rendered, we can display some skeleton components while they are loading.

```tsx
<Suspense
  fallback={[...Array(6)].map((_, i) => (
    <SlowComponentSkeleton key={i} />
  ))}
>
  {[...Array(10)].map((_, i) => (
    <SlowComponent key={i} />
  ))}
</Suspense>
```

![Recording of the page waiting with skeleton components until the slow components render](/blog/6_suspense_example.gif)

This example wraps the full page, but you can place smaller suspense boundaries around individual sections.

A single suspense boundary keeps all ten components in a loading state until they finish rendering. Separate boundaries would let each component appear as soon as it is ready, though I find that distracting in lists.

### Note

My first approach was to just add a `Suspense` component in the same page I was fetching the data from, assuming some kind of magic in Next.js that would stream the components inside the suspense boundary as they were rendered. This isn't the case. You need to have separate async components that are rendered on the server, and then wrapped in a suspense boundary in the page or a separate component.

### Source code

You can find the full example on <https://gitlab.com/rogerclotet/nextjs-suspense-example>.
