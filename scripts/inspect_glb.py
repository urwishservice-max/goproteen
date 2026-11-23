import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath="public/models/GoProTeen_model.glb")

for obj in bpy.context.scene.objects:
    pname = obj.parent.name if obj.parent else "None"
    print(f"OBJ: {obj.name}, parent: {pname}, loc: {obj.location}, rot: {obj.rotation_euler}, dims: {obj.dimensions}")
