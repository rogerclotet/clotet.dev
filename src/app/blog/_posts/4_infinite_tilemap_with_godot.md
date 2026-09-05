---
title: Infinite TileMap with Godot 4
description: How I'm generating an infinite TileMap with random tiles and chunk loading using Godot
slug: infinite-tilemap-with-godot-4
tags: ["gamedev", "godot", "gdscript"]
date: 2023-04-26
---

I'm working on a game called Drift Survivors. It mixes an arcade driving game and Vampire Survivors. You drive around in a post-apocalyptic world, fighting against hordes of enemies with weapons or even running them over.

The game uses 2D pixel art. I wanted infinite terrain that changes each time you play, generated as needed to limit resource use and avoid storing every tile. I also plan to add random decorations.

If you search online, the usual solution for this is some kind of chunk loading: you generate tiles around your player character and when you get too close to the edge you generate more of it. This is usually done with the terrain stored on disk, but a similar solution can work to generate random terrain.

### Node structure and first approach

The node structure for the map scene is as follows:

![Node structure](./4_1_node_structure.jpg)

- Map: main [Node2D](https://docs.godotengine.org/en/stable/classes/class_node2d.html) for positioning, with the script that will manage the logic to generate new tiles.
- TileMap: the Godot [TileMap](https://docs.godotengine.org/en/stable/classes/class_tilemap.html) itself, which contains the TileSet and tiles.
- VisibilityNotifier: a [VisibleOnScreenNotifier2D](https://docs.godotengine.org/en/stable/classes/class_visibleonscreennotifier2d.html) node that emits a signal when the camera stops having visibility of the defined rectangle. This will allow us to know when the player is getting too far and trigger the tile generation, as we will see later.

My first approach checked the player's `global_position` against a threshold. Performance was fine, but I wanted to avoid checking several times per second when the player had barely moved.

I then found `VisibleOnScreenNotifier2D`. I placed it at the center of the map, sized it to the screen resolution, and connected its signal to `map.gd`. When the signal fires, the script moves the notifier and generates tiles around the player:

```gdscript
func _on_exited_chunk():
  visibility_notifier.global_position = _get_player_position()
  _populate_terrain()
```

And `_populate_terrain` is as simple as this for now:

```gdscript
func _populate_terrain()
  var player_position = _get_player_position()

  for i in range(-CHUNK_SIZE * 2, CHUNK_SIZE * 2):
    for j in range(-CHUNK_SIZE * 2, CHUNK_SIZE * 2):
      var pos = player_position + Vector2i(i, j)
      if _is_empty(pos):
        _populate_cell(pos, _pick_random_tile())  
```

### Improving performance

This generated the proper tiles, but there was some stuttering every time new tiles were generated. After doing some research, it seemed most people used threads to avoid doing a lot of changes in the main thread, which should eliminate the frame drops. I didn't find a lot of detailed examples, but it seemed people were creating a copy of the TileMap, editing it, and then swapping it for the one in the scene tree, to avoid editing the active one. It turns out this created more problems than it solved for me, and in the end I just needed to use a separate thread and some `call_deferred` to set the cells. The code looks like this:

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

This removed the stuttering, but tiles kept accumulating, including ones the player might never see again. To limit resource use, we can periodically remove distant tiles:

```gdscript
func _clean_up(player_position: Vector2i) -> void:
  var used_cells = tilemap.get_used_cells_by_id(TERRAIN_LAYER_ID)

  for cell in used_cells:
    if not _is_near_player(cell, player_position):
      tilemap.set_cell.call_deferred(TERRAIN_LAYER_ID, cell)
```

### Conclusion

TileMaps are very powerful in Godot 4, they're surprisingly better than in Godot 3, completely revamped and a lot more useful than before.

The difficult part was changing many tiles at once without hurting performance. A separate thread with `call_deferred` works for now, though I may need to revisit it if I add more layers or elements to the TileMap.

You can see and use the full implementation here: <https://gitlab.com/drift-survivors/drift-survivors>
