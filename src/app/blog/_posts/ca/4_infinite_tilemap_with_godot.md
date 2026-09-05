---
title: "Un TileMap infinit amb Godot 4"
description: "Com genero un TileMap infinit amb caselles aleatòries i càrrega per blocs amb Godot"
---

Estic treballant en un joc que es diu Drift Survivors. Combina un joc de conducció arcade amb Vampire Survivors. Condueixes per un món postapocalíptic i lluites contra hordes d'enemics amb armes o fins i tot atropellant-los.

El joc fa servir gràfics de píxels en 2D. Volia un terreny infinit que canviés a cada partida, generat a mesura que calgués per limitar l'ús de recursos i evitar haver de desar cada casella. També tinc previst afegir-hi decoracions aleatòries.

Si ho busques a internet, la solució habitual és algun tipus de càrrega per blocs: generes caselles al voltant del jugador i, quan s'acosta massa al límit, en generes més. Normalment es fa amb terreny desat al disc, però una solució semblant pot servir per generar terreny aleatori.

### Estructura de nodes i primera aproximació

L'estructura de nodes de l'escena del mapa és aquesta:

![Estructura de nodes](/blog/4_1_node_structure.jpg)

- Map: el [Node2D](https://docs.godotengine.org/en/stable/classes/class_node2d.html) principal per al posicionament, amb l'script que gestiona la lògica per generar caselles noves.
- TileMap: el [TileMap](https://docs.godotengine.org/en/stable/classes/class_tilemap.html) de Godot, que conté el TileSet i les caselles.
- VisibilityNotifier: un node [VisibleOnScreenNotifier2D](https://docs.godotengine.org/en/stable/classes/class_visibleonscreennotifier2d.html) que emet un senyal quan la càmera deixa de veure el rectangle definit. Això ens permet saber quan el jugador s'allunya massa i activar la generació de caselles, com veurem més endavant.

La primera aproximació comparava la `global_position` del jugador amb un llindar. El rendiment era bo, però volia evitar fer la comprovació diverses vegades per segon quan el jugador gairebé no s'havia mogut.

Després vaig trobar `VisibleOnScreenNotifier2D`. El vaig col·locar al centre del mapa, amb la mida de la resolució de pantalla, i vaig connectar-ne el senyal a `map.gd`. Quan s'emet el senyal, l'script mou el notificador i genera caselles al voltant del jugador:

```gdscript
func _on_exited_chunk():
  visibility_notifier.global_position = _get_player_position()
  _populate_terrain()
```

I, de moment, `_populate_terrain` és tan senzill com això:

```gdscript
func _populate_terrain()
  var player_position = _get_player_position()

  for i in range(-CHUNK_SIZE * 2, CHUNK_SIZE * 2):
    for j in range(-CHUNK_SIZE * 2, CHUNK_SIZE * 2):
      var pos = player_position + Vector2i(i, j)
      if _is_empty(pos):
        _populate_cell(pos, _pick_random_tile())  
```

### Millorar el rendiment

Això generava les caselles correctes, però hi havia petites aturades cada vegada que se'n generaven de noves. Després d'investigar, semblava que la majoria feia servir fils d'execució per evitar fer molts canvis al fil principal i així eliminar les caigudes de fotogrames. No vaig trobar gaires exemples detallats, però semblava que creaven una còpia del TileMap, l'editaven i després la substituïen per la de l'arbre d'escenes per evitar editar l'activa. A mi això em va crear més problemes dels que resolia, i al final només em va caldre un fil separat i algunes crides a `call_deferred` per establir les caselles. El codi és així:

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

Això va eliminar les aturades, però les caselles continuaven acumulant-se, incloses les que el jugador potser no tornaria a veure mai. Per limitar l'ús de recursos, podem eliminar periòdicament les caselles llunyanes:

```gdscript
func _clean_up(player_position: Vector2i) -> void:
  var used_cells = tilemap.get_used_cells_by_id(TERRAIN_LAYER_ID)

  for cell in used_cells:
    if not _is_near_player(cell, player_position):
      tilemap.set_cell.call_deferred(TERRAIN_LAYER_ID, cell)
```

### Conclusió

Els TileMap de Godot 4 són molt potents. Han millorat molt respecte als de Godot 3, s'han renovat completament i són molt més útils.

La part difícil era canviar moltes caselles alhora sense perjudicar el rendiment. Un fil separat amb `call_deferred` funciona de moment, tot i que potser ho hauré de revisar si afegeixo més capes o elements al TileMap.

Pots veure i fer servir la implementació completa aquí: <https://gitlab.com/drift-survivors/drift-survivors>
