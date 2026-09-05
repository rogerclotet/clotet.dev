---
title: "Un TileMap infinito con Godot 4"
description: "Cómo genero un TileMap infinito con casillas aleatorias y carga por bloques con Godot"
---

Estoy trabajando en un juego llamado Drift Survivors. Combina un juego de conducción arcade con Vampire Survivors. Conduces por un mundo postapocalíptico y luchas contra hordas de enemigos con armas o incluso atropellándolos.

El juego usa gráficos de píxeles en 2D. Quería un terreno infinito que cambiara en cada partida, generado según hiciera falta para limitar el uso de recursos y evitar tener que guardar cada casilla. También tengo previsto añadir decoraciones aleatorias.

Si lo buscas en internet, la solución habitual es algún tipo de carga por bloques: generas casillas alrededor del jugador y, cuando se acerca demasiado al límite, generas más. Normalmente se hace con terreno guardado en disco, pero una solución parecida puede servir para generar terreno aleatorio.

### Estructura de nodos y primera aproximación

La estructura de nodos de la escena del mapa es esta:

![Estructura de nodos](/blog/4_1_node_structure.jpg)

- Map: el [Node2D](https://docs.godotengine.org/en/stable/classes/class_node2d.html) principal para el posicionamiento, con el script que gestiona la lógica para generar nuevas casillas.
- TileMap: el [TileMap](https://docs.godotengine.org/en/stable/classes/class_tilemap.html) de Godot, que contiene el TileSet y las casillas.
- VisibilityNotifier: un nodo [VisibleOnScreenNotifier2D](https://docs.godotengine.org/en/stable/classes/class_visibleonscreennotifier2d.html) que emite una señal cuando la cámara deja de ver el rectángulo definido. Esto nos permite saber cuándo el jugador se aleja demasiado y activar la generación de casillas, como veremos más adelante.

La primera aproximación comparaba la `global_position` del jugador con un umbral. El rendimiento era bueno, pero quería evitar hacer la comprobación varias veces por segundo cuando el jugador apenas se había movido.

Después encontré `VisibleOnScreenNotifier2D`. Lo coloqué en el centro del mapa, con el tamaño de la resolución de pantalla, y conecté su señal a `map.gd`. Cuando se emite la señal, el script mueve el notificador y genera casillas alrededor del jugador:

```gdscript
func _on_exited_chunk():
  visibility_notifier.global_position = _get_player_position()
  _populate_terrain()
```

Y, por ahora, `_populate_terrain` es tan sencillo como esto:

```gdscript
func _populate_terrain()
  var player_position = _get_player_position()

  for i in range(-CHUNK_SIZE * 2, CHUNK_SIZE * 2):
    for j in range(-CHUNK_SIZE * 2, CHUNK_SIZE * 2):
      var pos = player_position + Vector2i(i, j)
      if _is_empty(pos):
        _populate_cell(pos, _pick_random_tile())  
```

### Mejorar el rendimiento

Esto generaba las casillas correctas, pero había pequeños tirones cada vez que se generaban nuevas. Después de investigar, parecía que la mayoría usaba hilos de ejecución para evitar hacer muchos cambios en el hilo principal y así eliminar las caídas de fotogramas. No encontré muchos ejemplos detallados, pero parecía que creaban una copia del TileMap, la editaban y después la sustituían por la del árbol de escenas para evitar editar la activa. A mí eso me creó más problemas de los que resolvía, y al final solo necesité un hilo separado y algunas llamadas a `call_deferred` para establecer las casillas. El código es así:

```gdscript
func _populate_cell(pos: Vector2i, tile: Vector2i) -> void:
  var player_position = _get_player_position()

  for i in range(-CHUNK_SIZE * 2, CHUNK_SIZE * 2):
    for j in range(-CHUNK_SIZE * 2, CHUNK_SIZE * 2):
      var pos = player_position + Vector2i(i, j)
      if _is_empty(pos):
        _populate_cell(pos, _pick_random_tile()) 

func _populate_cell(pos: Vector2i, tile: Vector2i) -> void:
  tilemap.set_cell.call_deferred(
    TERRAIN_LAYER_ID, pos, TERRAIN_SOURCE_ID, tile, ALTERNATIVE_TILE_ID
  )

func _on_exited_chunk():
  visibility_notifier.global_position = (
    get_tree().get_first_node_in_group(Player.GROUP).global_position
  )

  var thread = Thread.new()
  thread.start(func(): _populate_terrain())
  thread.wait_to_finish()
```

Esto eliminó los tirones, pero las casillas seguían acumulándose, incluidas las que el jugador quizá nunca volvería a ver. Para limitar el uso de recursos, podemos eliminar periódicamente las casillas lejanas:

```gdscript
func _clean_up(player_position: Vector2i) -> void:
  var used_cells = tilemap.get_used_cells_by_id(TERRAIN_LAYER_ID)

  for cell in used_cells:
    if not _is_near_player(cell, player_position):
      tilemap.set_cell.call_deferred(TERRAIN_LAYER_ID, cell)
```

### Conclusión

Los TileMap de Godot 4 son muy potentes. Han mejorado mucho respecto a los de Godot 3, se han renovado por completo y son mucho más útiles.

La parte difícil era cambiar muchas casillas a la vez sin perjudicar el rendimiento. Un hilo separado con `call_deferred` funciona por ahora, aunque quizá tenga que revisarlo si añado más capas o elementos al TileMap.

Puedes ver y usar la implementación completa aquí: <https://gitlab.com/drift-survivors/drift-survivors>
