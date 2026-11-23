import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath="public/models/GoProTeen_model.glb")

wrap = bpy.data.objects.get("GoProTeen_Main_Wrapper")
top = bpy.data.objects.get("GP_TOP_CHOCOLATE_SHELL")
core = bpy.data.objects.get("GP_PROTEIN_NUT_CORE")
bot = bpy.data.objects.get("GP_BOTTOM_CHOCOLATE_SHELL")

print("WRAPPER bound box (X, Y, Z):")
for b in wrap.bound_box:
    print("  ", [round(v, 4) for v in b])

print("TOP SHELL bound box (X, Y, Z):")
for b in top.bound_box:
    print("  ", [round(v, 4) for v in b])

print("BOT SHELL bound box (X, Y, Z):")
for b in bot.bound_box:
    print("  ", [round(v, 4) for v in b])
