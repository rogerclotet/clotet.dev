---
description: "Adivina los municipios de Cataluña a partir de sus escudos"
---

Un juego diario de adivinar municipios que incluye los 947 municipios de Cataluña, creado como una aplicación web instalable. Todos tienen el mismo municipio cada día. La pista inicial es su escudo, o una bandera o fotografía si no tiene escudo.

Cada intento compara el municipio que has dicho con la respuesta. Recibes pistas sobre la población, la superficie, la altitud, la comarca, la provincia y la longitud del nombre, además de la distancia y la dirección hasta el municipio correcto. Cuando lo aciertas, puedes comparar el número de intentos con el del resto de jugadores de ese día.

Los datos proceden de Wikidata, con la misma fuente SPARQL que la lista de municipios de Wikipedia, y las imágenes son de Wikimedia Commons. Lo creé con Next.js, Tailwind CSS, Drizzle ORM y PostgreSQL. La fecha determina el reto diario, de modo que todos los clientes eligen el mismo sin consultar un servidor. Una Server Action comprueba los intentos y mantiene la respuesta fuera del navegador hasta que la aciertas.
