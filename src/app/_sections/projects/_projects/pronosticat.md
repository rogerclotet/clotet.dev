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

An installable web app for predicting football results with friends. Each matchday gives you a board of five challenges, including the exact score, the biggest margin of victory, the whitewash, and the goal machine. You can use each square once by assigning it to a match or team. The game supports LaLiga, the Premier League, and the Champions League.

Playing a square is free, but you can't change your pick once you've made it. Results update automatically, and a group leaderboard tracks everyone's predictions across the season.

I built it with Next.js and Tailwind CSS, with a brutalist design aimed at mobile screens. It uses Drizzle ORM with PostgreSQL, Better Auth for Google and magic-link sign-in, next-intl for Catalan localization, and football-data.org for match data. A GitHub Actions pipeline runs lint, type checks, and tests before deploying to production with Docker.
