import bpy, math

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath="public/models/GoProTeen_model.glb")

wrap = bpy.data.objects.get("GoProTeen_Main_Wrapper")
ctrl = bpy.data.objects.get("GP_EXPLODE_CONTROLLER")
top = bpy.data.objects.get("GP_TOP_CHOCOLATE_SHELL")

print("Top shell world matrix:")
print(top.matrix_world)

# Check top shell bounding box in world coordinates
print("Top shell world bounds:")
for b in top.bound_box:
    world_b = top.matrix_world @ mathutils.Vector(b)
    print(" ", [round(v, 4) for v in world_b])
