---
title: Infinite TileMap with Godot 4
description: How I'm generating an infinite TileMap with random tiles and chunk loading using Godot
slug: infinite-tilemap-with-godot-4
tags: ["gamedev", "godot", "gdscript"]
date: 2023-04-26
---

I'm working in a game called Drift Survivors. It's basically a mix between an arcade driving game and Vampire Survivors. You drive around in a post-apocalyptic world, fighting against hordes of enemies with weapons or even running them over.

The game uses 2D pixel art, and for the terrain I wanted it to be infinite, non-repetitive, and be generated automatically when needed to avoid using too many resources or having to save each tile in a specific place. This gives the game a sense of exploration, since every time you start a game the terrain -and some decoration coming in the future- will be unique.

If you search online, the usual solution for this is some kind of chunk loading: you generate tiles around your player character and when you get too close to the edge you generate more of it. This is usually done with the terrain stored in disk, but a similar solution can work to generate random terrain.

### Node structure and first approach

The node structure for the map scene is as follows:

![Node structure](./4_1_node_structure.jpg)

- Map: main [Node2D](https://docs.godotengine.org/en/stable/classes/class_node2d.html) for positioning, with the script that will manage the logic to generate new tiles.
- TileMap: the Godot [TileMap](https://docs.godotengine.org/en/stable/classes/class_tilemap.html) itself, which contains the TileSet and tiles.
- VisibilityNotifier: a [VisibleOnScreenNotifier2D](https://docs.godotengine.org/en/stable/classes/class_visibleonscreennotifier2d.html) node that emits a signal when the camera stops having visibility of the defined rectangle. This will allow us to know when the player is getting too far and trigger the tile generation, as we will see later.

My first naive approach was to check the Player's `global_position` to see if it went too far from a threshold, but even if performance was not really affected, it didn't seem right to make this kind of check multiple times per second, even if the player didn't move a lot.

After searching for a better solution, I learned about `VisibleOnScreenNotifier2D` and it feels a lot cleaner. I set it at the center of the map with a fixed size based on screen resolution, and connect the signal to the `map.gd` script and move the visibility notifier and call the function that generates new tiles around the player position:

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

This generated the proper tiles, but there was some stuttering every time new tiles were generated. After doing some research, it seemed most people used threads to avoid doing a lot of changes in the main thread, which should eliminate the frame drops. I didn't find a lot of detailed examples, but it seemed people were creating a copy of the TileMap, editing it, and then swapping it for the one in the scene tree, to avoid editing the active one. It turns out this caused more problems than solutions for me, and in the end I just needed to use a separate thread and some `call_deferred` to set the cells. The code looks like this:

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

This worked a lot better. It didn't stutter, but if you noticed, we're just adding more and more tiles, and some of them won't be visible ever again. To avoid cluttering the TileMap and using too many resources, we can add a simple function that cleans up far away tiles from time to time:

```gdscript
func _clean_up(player_position: Vector2i) -> void:
  var used_cells = tilemap.get_used_cells_by_id(TERRAIN_LAYER_ID)

  for cell in used_cells:
    if not _is_near_player(cell, player_position):
      tilemap.set_cell.call_deferred(TERRAIN_LAYER_ID, cell)
```

### Conclusion

TileMaps are very powerful in Godot 4, they're surprisingly better than in Godot 3, completely revamped and a lot more useful than before.

What I was a bit confused about was on how to change a lot of tiles at once without affecting performance, and for now just using a separate thread with `call_deferred` seems to work, but maybe I have to revisit this in the future if I add more layers or elements to the TileMap.

You can see and use the full implementation here: <https://gitlab.com/drift-survivors/drift-survivors>
