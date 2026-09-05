---
title: "Suspense en los componentes de servidor de Next.js"
description: "Usar Suspense para mostrar estados de carga en los componentes de servidor de Next.js"
---

Desde React 18 he intentado entender cómo usar `Suspense` para obtener datos. Este ejemplo me ayudó a entenderlo.

En el App Router de Next.js tienes dos maneras de mostrar estados de carga en páginas generadas en el servidor:

- Añadir un archivo `loading.tsx` junto a `page.tsx`. Es la manera más sencilla, y Next.js lo mostrará automáticamente hasta que la página esté lista.
- Envolver los componentes con límites de `Suspense` manualmente. Requiere más trabajo, pero permite mostrar un estado de carga para una parte de la página.

Puedes leer más en la [documentación de Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states).

### Ejemplo

Esto es útil cuando un componente de servidor asíncrono obtiene datos, por ejemplo de una base de datos, y quieres mostrar un estado de carga mientras se renderiza.

En este ejemplo, `SlowComponent` espera un tiempo aleatorio entre cero y tres segundos antes de renderizarse.

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

Renderizar diez de estos componentes en una página hará que tengas que esperar casi tres segundos la mayoría de las veces, porque hay que esperar a que el componente más lento termine de renderizarse.

```text
Rendered after 162ms
Rendered after 545ms
...
Rendered after 2805ms
Rendered after 2911ms
```

Si añadimos un límite de Suspense alrededor de los componentes lentos, podemos mostrar unos componentes de esqueleto mientras se cargan.

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

![Grabación de la página con componentes de esqueleto mientras espera a que se rendericen los componentes lentos](/blog/6_suspense_example.gif)

Este ejemplo envuelve toda la página, pero puedes poner límites de Suspense más pequeños alrededor de secciones individuales.

Un único límite de Suspense mantiene los diez componentes en estado de carga hasta que todos terminan de renderizarse. Con límites separados, cada componente aparecería en cuanto estuviera listo, aunque en listas me resulta molesto.

### Nota

Mi primer intento fue añadir un componente `Suspense` en la misma página donde obtenía los datos, suponiendo que Next.js enviaría progresivamente los componentes dentro del límite de Suspense a medida que se renderizaran. No funciona así. Hay que tener componentes asíncronos separados que se rendericen en el servidor y envolverlos con un límite de Suspense en la página o en otro componente.

### Código fuente

Puedes encontrar el ejemplo completo en <https://gitlab.com/rogerclotet/nextjs-suspense-example>.
