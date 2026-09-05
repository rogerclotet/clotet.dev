---
description: "Pronostica resultats de futbol amb els teus amics"
---

Una aplicació web instal·lable per pronosticar resultats de futbol amb amics. Cada jornada tens un tauler de cinc reptes, com ara el resultat exacte, la victòria més àmplia, la porteria a zero i la màquina de fer gols. Pots fer servir cada casella una vegada assignant-la a un partit o equip. El joc inclou LaLiga, la Premier League i la Champions League.

Jugar una casella és gratuït, però no pots canviar el pronòstic un cop l'has fet. Els resultats s'actualitzen automàticament i una classificació del grup segueix els pronòstics de tothom al llarg de la temporada.

La vaig crear amb Next.js i Tailwind CSS, amb un disseny brutalista pensat per a pantalles de mòbil. Fa servir Drizzle ORM amb PostgreSQL, Better Auth per iniciar sessió amb Google i enllaços d'accés, next-intl per a la localització al català i football-data.org per a les dades dels partits. Un flux de GitHub Actions executa el linter, la comprovació de tipus i les proves abans de desplegar a producció amb Docker.
