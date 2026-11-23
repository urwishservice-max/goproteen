import bpy

bpy.ops.wm.open_mainfile(filepath="e:/Downloads/GoProTeen_Inside_Ingredients_V3.blend1")

for obj in bpy.context.scene.objects:
    print(f"OBJ: {obj.name}, parent: {obj.parent.name if obj.parent else None}, rot: {obj.rotation_euler}, dims: {obj.dimensions}")
