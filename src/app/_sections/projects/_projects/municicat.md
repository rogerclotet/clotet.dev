---
title: Municicat
slug: municicat
description: Guess Catalonia's municipalities from their coat of arms
category: game
image: /projects/municicat.png
link: https://municicat.clotet.dev
repo: https://github.com/rogerclotet/municicat
date: 2026-08-29
---

A daily guessing game for the 947 municipalities of Catalonia, built as an installable PWA. Every day the same municipality is chosen for everyone, and the only clue is its escut — or the flag or a photograph when no escut exists.

You name municipalities until you find it. Each guess tells you whether the answer has more or fewer people, more or less land, sits higher or lower, shares a comarca or a província, has a longer or shorter name, and how far away it is and in which direction. Once you solve it you see how your guess count compares with everyone else's that day.

The dataset comes from Wikidata (the same SPARQL source as Wikipedia's municipality list) and Wikimedia Commons imagery. Built with Next.js, Tailwind CSS, Drizzle ORM and PostgreSQL. The daily puzzle is a pure function of the date so every client agrees without asking a server, and guesses are evaluated in a Server Action so the answer never reaches the browser until you name it.
