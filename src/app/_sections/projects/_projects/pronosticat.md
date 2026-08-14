---
title: Pronosticat
slug: pronosticat
description: Predict football results with your friends
category: webapp
image: /projects/pronosticat.png
link: https://pronosti.cat
repo: https://github.com/rogerclotet/pronosticat
date: 2026-08-01
---

A PWA to predict football results with friends. Each matchday brings a board of 5 challenges — the exact score, the biggest margin of victory, the whitewash, the goal machine — and each square can only be spent once, betting it on a match or a team. Supports LaLiga, Premier League, and Champions League.

Playing a square is free, but once you commit it to a match or team you can't take it back, so every pick is a small risk-reward decision. Results sync automatically, and a group leaderboard tracks who's calling it best across the season.

Built with Next.js and Tailwind CSS for a mobile-first, brutalist design, Drizzle ORM with PostgreSQL, Better Auth for Google OAuth and magic-link sign-in, next-intl for the Catalan localization, and football-data.org for match data. Deployed via Docker with a GitHub Actions pipeline that runs lint, typecheck, and tests before pushing straight to production.
