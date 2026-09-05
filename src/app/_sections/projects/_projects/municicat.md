---
title: Municicat
slug: municicat
description: Guess Catalonia's municipalities from their coats of arms
category: game
image: /projects/municicat.png
link: https://municicat.clotet.dev
repo: https://github.com/rogerclotet/municicat
date: 2026-08-29
---

A daily guessing game covering Catalonia's 947 municipalities, built as an installable web app. Everyone gets the same municipality each day. Your starting clue is its coat of arms, or a flag or photograph if it has no coat of arms.

Each guess compares the municipality you named with the answer. You get clues about population, area, elevation, county, province, and name length, along with the distance and direction to the answer. Once you solve it, you can compare your guess count with everyone else's that day.

The data comes from Wikidata, using the same SPARQL source as Wikipedia's municipality list, and the images come from Wikimedia Commons. I built it with Next.js, Tailwind CSS, Drizzle ORM, and PostgreSQL. The date determines the daily puzzle, so every client selects the same one without asking a server. A Server Action checks guesses and keeps the answer out of the browser until you find it.
