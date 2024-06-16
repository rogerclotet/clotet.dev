---
title: "Multiplayer minesweeper with socket.io"
description: Introduction to the tech to implement a multiplayer minesweeper game using javascript and real time technologies
slug: multiplayer-minesweeper-with-socket-io
tags: ["frontend", "backend", "javascript", "nodejs", "react", "socket.io"]
date: 2021-05-11
---

The goal of this project was to learn some new technologies (new for me, of course) while completing a simple project 
from end to end.

I wanted to make something in real time to try out and learn Socket.IO, and a simple game with straightforward
multiplayer interactions seemed like a good idea. I had different ideas, like using [Phaser](https://phaser.io) to
create some new but simple game that could be played by any number of player, similar to [Agar.io](https://agar.io) and
its many clones.

That seemed a bit too much for the purpose of learning a real time communication library, so I ended up with a much
simpler concept: a turn-based multiplayer minesweeper.

My inspiration was Minesweeper Flags, the minesweeper game some of us played many years ago in MSN Instant Games within
MSN Messenger and Windows Live Messenger:

![Minesweeper Flags in MSN Instant Games](./minesweeper-flags.jpg "Minesweeper Flags")

In this game, players take turns revealing tiles on a board with the goal of finding as many mines as possible. The
player that finds the most mines when all of them have been found wins. There is also the **bomb**, a power up that
reveals a square of tiles at once, and it can be used once per game. When a player finds a mine, they can play again,
allowing for fun streaks and comebacks.

The main difference between the old game and my implementation is that the new one allows for an arbitrary amount of
players. You can set up a big board and play with a group of friends while talking in the game chat.

This is how it looks:

![Screenshot](/blog/minesweeper-screenshot.png)

### Tech breakdown

These are the technologies used in the full project:

| Client                                          | Server                                       | Shared                                                   |
|-------------------------------------------------|----------------------------------------------|----------------------------------------------------------|
| Rendering: [ReactJS](https://reactjs.org)       | Server: [NodeJS](https://nodejs.org)         | Real-time communication: [Socket.IO](https://socket.io/) |
| Styling: [TailwindCSS](https://tailwindcss.com) | Database: [MongoDB](https://www.mongodb.com) |                                                          |

From this table, the only thing I was familiar with was ReactJS, which would facilitate rendering the relevant
information to the DOM, keeping a client state, and handling user events.

### Socket.IO

Socket.IO was the more interesting and useful library I used. It has separate client and server libraries, with
support for several languages, and you can actually combine any of the implementations.

For simplicity’s sake, and since I haven't used NodeJS to build a server before, I decided to go with Javascript in both
client and server.

Here's a small example of client and server sending and handling messages:

```javascript
// Client

// Sending a message to create a room with custom parameters to the server:
socket.emit('create_room', gameType.boardSize, gameType.mineCount)

// Listening and handling a message from the server:
socket.on('room_created', ({ id }) => {
  // Handle `room_created` from the server using the parameter `id`.
})
```

```javascript
// Server

// Sending a message to the client connected to `socket`:
socket.emit('room_list', exportedRooms)

// Listening and handling a message from the client connected to `socket`:
socket.on('create_room', async ([boardSize, mineCount]) => {
  // Handle `create_room` using parameters `boardSize` and `mineCount` sent by client.
})
```

As you can see, messages are sent and received in a very similar way from the client and the server. There are some
differences and details to take into account, like for broadcasting a message to a room:

```javascript
// Server

// Add the user connected to `socket` to a room:
socket.join('room_' + state.currentRoomId)

// Send a message to a room:
io.to('room_' + room._id).emit('room', roomData)
```

If you want to learn more, you can see Socket.IO's excellent documentation [here](https://socket.io/docs).

There is also a very good [Get Started](https://socket.io/get-started) with some interesting small projects.

### I want to play

Sure, you can play the game on https://minesweeper.clotet.dev and see the code on
https://gitlab.com/rogerclotet/minesweeper.
