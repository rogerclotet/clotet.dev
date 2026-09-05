---
description: "Endevina els municipis de Catalunya a partir dels seus escuts"
---

Un joc diari d'endevinar municipis que inclou els 947 municipis de Catalunya, creat com una aplicació web instal·lable. Tothom té el mateix municipi cada dia. La pista inicial és el seu escut, o una bandera o fotografia si no en té.

Cada intent compara el municipi que has dit amb la resposta. Reps pistes sobre la població, la superfície, l'altitud, la comarca, la província i la llargada del nom, a més de la distància i la direcció fins al municipi correcte. Quan l'encertes, pots comparar el nombre d'intents amb el de la resta de jugadors d'aquell dia.

Les dades provenen de Wikidata, amb la mateixa font SPARQL que la llista de municipis de la Viquipèdia, i les imatges són de Wikimedia Commons. El vaig crear amb Next.js, Tailwind CSS, Drizzle ORM i PostgreSQL. La data determina el repte diari, de manera que tots els clients trien el mateix sense consultar un servidor. Una Server Action comprova els intents i manté la resposta fora del navegador fins que l'encertes.
