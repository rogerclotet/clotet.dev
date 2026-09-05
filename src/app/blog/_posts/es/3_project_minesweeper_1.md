---
title: "Buscaminas multijugador con Socket.IO"
description: "Cómo creé un juego de buscaminas multijugador con JavaScript y Socket.IO"
---

Creé este proyecto para aprender tecnologías que no había usado antes y terminar un pequeño juego de principio a fin.

Quería hacer algo en tiempo real para probar y aprender Socket.IO, y un juego sencillo con interacciones multijugador simples me pareció una buena idea. Tenía varias ideas, como usar [Phaser](https://phaser.io) para crear un juego nuevo pero sencillo en el que pudiera participar cualquier número de jugadores, parecido a [Agar.io](https://agar.io) y sus muchos clones.

Me pareció demasiado para el objetivo de aprender una biblioteca de comunicación en tiempo real, así que acabé eligiendo un concepto mucho más sencillo: un buscaminas multijugador por turnos.

Me inspiré en Minesweeper Flags, el buscaminas al que algunos jugábamos hace muchos años en MSN Instant Games, dentro de MSN Messenger y Windows Live Messenger:

![Minesweeper Flags en MSN Instant Games](/blog/minesweeper-flags.jpg "Minesweeper Flags")

En este juego, los jugadores destapan casillas por turnos con el objetivo de encontrar tantas minas como puedan. Gana quien encuentra más cuando se han descubierto todas. También está la **bomba**, una ayuda que destapa un cuadrado de casillas a la vez y que se puede usar una vez por partida. Cuando un jugador encuentra una mina, puede volver a jugar, lo que permite rachas y remontadas divertidas.

La diferencia principal entre el juego antiguo y mi implementación es que el nuevo admite cualquier número de jugadores. Puedes configurar un tablero grande y jugar con un grupo de amigos mientras habláis por el chat del juego.

Este es su aspecto:

![Captura de pantalla](/blog/minesweeper-screenshot.png)

### Tecnologías utilizadas

Estas son las tecnologías de todo el proyecto:

| Cliente | Servidor | Compartido |
|---------|----------|------------|
| Renderizado: [ReactJS](https://reactjs.org) | Servidor: [NodeJS](https://nodejs.org) | Comunicación en tiempo real: [Socket.IO](https://socket.io/) |
| Estilos: [TailwindCSS](https://tailwindcss.com) | Base de datos: [MongoDB](https://www.mongodb.com) | |

React era la única tecnología de esta tabla que ya conocía. La usé para mostrar la interfaz, mantener el estado del cliente y gestionar los eventos de usuario.

### Socket.IO

Socket.IO fue la biblioteca más interesante y útil que usé. Tiene bibliotecas separadas para el cliente y el servidor, con soporte para varios lenguajes, y puedes combinar cualquiera de las implementaciones.

Para simplificar las cosas, y porque nunca había creado un servidor con Node.js, usé JavaScript tanto en el cliente como en el servidor.

Aquí tienes un pequeño ejemplo de cómo el cliente y el servidor envían y gestionan mensajes:

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

Como puedes ver, los mensajes se envían y se reciben de forma muy parecida desde el cliente y el servidor. Hay algunas diferencias y detalles que tener en cuenta, como al enviar un mensaje a toda una sala:

```javascript
// Server

// Add the user connected to `socket` to a room:
socket.join('room_' + state.currentRoomId)

// Send a message to a room:
io.to('room_' + room._id).emit('room', roomData)
```

Si quieres saber más, puedes consultar la documentación de Socket.IO [aquí](https://socket.io/docs).

También hay una buena [guía para empezar](https://socket.io/get-started) con pequeños proyectos interesantes.

### Quiero jugar

Puedes jugar en <https://minesweeper.clotet.dev> y ver el código en <https://gitlab.com/rogerclotet/minesweeper>.
