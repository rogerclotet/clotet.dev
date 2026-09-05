---
title: "Buscamines multijugador amb Socket.IO"
description: "Com vaig crear un joc de buscamines multijugador amb JavaScript i Socket.IO"
---

Vaig crear aquest projecte per aprendre tecnologies que no havia fet servir abans i acabar un petit joc de principi a fi.

Volia fer alguna cosa en temps real per provar i aprendre Socket.IO, i un joc senzill amb interaccions multijugador simples em va semblar una bona idea. Tenia diverses idees, com ara fer servir [Phaser](https://phaser.io) per crear un joc nou però senzill en què pogués participar qualsevol nombre de jugadors, semblant a [Agar.io](https://agar.io) i els seus molts clons.

Em va semblar massa per a l'objectiu d'aprendre una biblioteca de comunicació en temps real, així que vaig acabar triant un concepte molt més senzill: un buscamines multijugador per torns.

Em vaig inspirar en Minesweeper Flags, el buscamines que alguns jugàvem fa molts anys a MSN Instant Games, dins de MSN Messenger i Windows Live Messenger:

![Minesweeper Flags a MSN Instant Games](/blog/minesweeper-flags.jpg "Minesweeper Flags")

En aquest joc, els jugadors destapen caselles per torns amb l'objectiu de trobar tantes mines com puguin. Guanya qui en troba més quan s'han descobert totes. També hi ha la **bomba**, una ajuda que destapa un quadrat de caselles alhora i que es pot fer servir una vegada per partida. Quan un jugador troba una mina, pot tornar a jugar, cosa que permet ratxes i remuntades divertides.

La diferència principal entre el joc antic i la meva implementació és que el nou admet qualsevol nombre de jugadors. Pots configurar un tauler gran i jugar amb un grup d'amics mentre parleu pel xat del joc.

Aquest és el seu aspecte:

![Captura de pantalla](/blog/minesweeper-screenshot.png)

### Tecnologies utilitzades

Aquestes són les tecnologies de tot el projecte:

| Client | Servidor | Compartit |
|--------|----------|-----------|
| Renderització: [ReactJS](https://reactjs.org) | Servidor: [NodeJS](https://nodejs.org) | Comunicació en temps real: [Socket.IO](https://socket.io/) |
| Estils: [TailwindCSS](https://tailwindcss.com) | Base de dades: [MongoDB](https://www.mongodb.com) | |

React era l'única tecnologia d'aquesta taula que ja coneixia. La vaig fer servir per mostrar la interfície, mantenir l'estat del client i gestionar els esdeveniments d'usuari.

### Socket.IO

Socket.IO va ser la biblioteca més interessant i útil que vaig fer servir. Té biblioteques separades per al client i el servidor, amb suport per a diversos llenguatges, i pots combinar qualsevol de les implementacions.

Per simplificar les coses, i perquè no havia creat mai un servidor amb Node.js, vaig fer servir JavaScript tant al client com al servidor.

Aquí tens un petit exemple de com el client i el servidor envien i gestionen missatges:

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

Com pots veure, els missatges s'envien i es reben de manera molt semblant des del client i el servidor. Hi ha algunes diferències i detalls que cal tenir en compte, com ara per enviar un missatge a tota una sala:

```javascript
// Server

// Add the user connected to `socket` to a room:
socket.join('room_' + state.currentRoomId)

// Send a message to a room:
io.to('room_' + room._id).emit('room', roomData)
```

Si en vols saber més, pots consultar la documentació de Socket.IO [aquí](https://socket.io/docs).

També hi ha una bona [guia per començar](https://socket.io/get-started) amb petits projectes interessants.

### Vull jugar-hi

Pots jugar a <https://minesweeper.clotet.dev> i veure el codi a <https://gitlab.com/rogerclotet/minesweeper>.
