---
title: "Suspense als components de servidor de Next.js"
description: "Fer servir Suspense per mostrar estats de càrrega als components de servidor de Next.js"
---

Des de React 18 he intentat entendre com fer servir `Suspense` per obtenir dades. Aquest exemple em va ajudar a entendre-ho.

A l'App Router de Next.js tens dues maneres de mostrar estats de càrrega en pàgines generades al servidor:

- Afegir un fitxer `loading.tsx` al costat de `page.tsx`. És la manera més senzilla, i Next.js el mostrarà automàticament fins que la pàgina estigui llesta.
- Envoltar els components amb límits de `Suspense` manualment. Requereix més feina, però permet mostrar un estat de càrrega per a una part de la pàgina.

En pots llegir més a la [documentació de Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states).

### Exemple

Això és útil quan un component de servidor asíncron obté dades, per exemple d'una base de dades, i vols mostrar un estat de càrrega mentre es renderitza.

En aquest exemple, `SlowComponent` espera un temps aleatori entre zero i tres segons abans de renderitzar-se.

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

Renderitzar deu d'aquests components en una pàgina farà que hagis d'esperar gairebé tres segons la majoria de vegades, perquè cal esperar que el component més lent acabi de renderitzar-se.

```text
Rendered after 162ms
Rendered after 545ms
...
Rendered after 2805ms
Rendered after 2911ms
```

Si afegim un límit de Suspense al voltant dels components lents, podem mostrar uns components d'esquelet mentre es carreguen.

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

![Gravació de la pàgina amb components d'esquelet mentre espera que es renderitzin els components lents](/blog/6_suspense_example.gif)

Aquest exemple envolta tota la pàgina, però pots posar límits de Suspense més petits al voltant de seccions individuals.

Un únic límit de Suspense manté els deu components en estat de càrrega fins que tots acaben de renderitzar-se. Amb límits separats, cada component apareixeria tan bon punt estigués llest, tot i que en llistes ho trobo molest.

### Nota

El meu primer intent va ser afegir un component `Suspense` a la mateixa pàgina on obtenia les dades, suposant que Next.js enviaria progressivament els components de dins del límit de Suspense a mesura que es renderitzessin. No funciona així. Cal tenir components asíncrons separats que es renderitzin al servidor i envoltar-los amb un límit de Suspense a la pàgina o en un altre component.

### Codi font

Pots trobar l'exemple complet a <https://gitlab.com/rogerclotet/nextjs-suspense-example>.
