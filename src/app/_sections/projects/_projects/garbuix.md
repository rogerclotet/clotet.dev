---
title: Garbuix!
slug: garbuix
description: A crossword game in Catalan
category: game
image: /projects/garbuix.png
link: https://garbuix.app
repo: https://github.com/rogerclotet/garbuix
date: 2025-12-28
---

A crossword mini-game, inspired by games like [Wordle](https://www.nytimes.com/games/wordle/) and [Paraulogic](https://www.vilaweb.cat/paraulogic/).

A set of random words are chosen per day (with a seeded random) from 6 random letters, and a crossword is generated with those words. The player has to guess the words in the crossword, counting the number of attempts. They also have up to 3 hints that show a letter from the ones that are not yet revealed.

I used an open dictionary from [TermCat](https://www.termcat.cat/) with the words from [IATE](https://iate.europa.eu/) as a base, keeping only words without spaces or punctuation that are not too short (3 or more letters).

I used TanStack Start as a framework, to learn a bit more about its features and how it can be used to build web applications. It's a really simple project, but it's a good starting point to learn how to use technologies I'm not that familiar with.

You can play it [here](https://garbuix.app). How many words can you guess?
