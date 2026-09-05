---
description: "Pronostica resultados de fútbol con tus amigos"
---

Una aplicación web instalable para pronosticar resultados de fútbol con amigos. Cada jornada tienes un tablero de cinco retos, como el resultado exacto, la victoria más amplia, la portería a cero y la máquina de hacer goles. Puedes usar cada casilla una vez asignándola a un partido o equipo. El juego incluye LaLiga, la Premier League y la Champions League.

Jugar una casilla es gratis, pero no puedes cambiar el pronóstico una vez hecho. Los resultados se actualizan automáticamente y una clasificación del grupo sigue los pronósticos de todos a lo largo de la temporada.

La creé con Next.js y Tailwind CSS, con un diseño brutalista pensado para pantallas de móvil. Utiliza Drizzle ORM con PostgreSQL, Better Auth para iniciar sesión con Google y enlaces de acceso, next-intl para la localización al catalán y football-data.org para los datos de los partidos. Un flujo de GitHub Actions ejecuta el linter, la comprobación de tipos y las pruebas antes de desplegar a producción con Docker.
