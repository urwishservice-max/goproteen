import bpy, math, os, mathutils

# Reset blender
bpy.ops.wm.read_factory_settings(use_empty=True)

# Import current GLB
glb_path = r"public/models/GoProTeen_model.glb"
bpy.ops.import_scene.gltf(filepath=glb_path)

wrap = bpy.data.objects.get("GoProTeen_Main_Wrapper")
ctrl = bpy.data.objects.get("GP_EXPLODE_CONTROLLER")
top = bpy.data.objects.get("GP_TOP_CHOCOLATE_SHELL")
core = bpy.data.objects.get("GP_PROTEIN_NUT_CORE")
bot = bpy.data.objects.get("GP_BOTTOM_CHOCOLATE_SHELL")

print("WRAPPER dims:", wrap.dimensions)

# In Blender:
# Wrapper has: X=0.1449 (Length), Y=0.0137 (Thickness), Z=0.0270 (Width).
# Wrapper front face (with logo) faces -Y.
# We want the inner bar to have:
# - Length along X
# - Top textured shell facing the front (-Y, or +Y if top of bar faces top of wrapper)
# - Width along Z
# - Thickness along Y

# Let's test rotating ctrl around X so its top shell aligns with wrapper front (-Y) or top
# In the original V3 model:
# Top shell was at +Z, bottom shell was at -Z, width was along Y.
# If we rotate ctrl by -90 deg around X:
# Original +Z (top shell) rotates to -Y (facing the front of the wrapper)!
# Original Y (width) rotates to +Z (matching wrapper width Z)!
# Original X (length) stays along X!

ctrl.rotation_euler = (math.radians(90), 0, 0)
bpy.context.view_layer.update()

# Now scale ctrl to fit snugly inside the wrapper
# Scale factor 0.78 gives:
# length ~ 0.0936 (wrapper length 0.145)
# width ~ 0.0218 (wrapper width 0.027)
# thickness ~ 0.0099 (wrapper thickness 0.0137)
scale_fit = 0.78
ctrl.scale = (scale_fit, scale_fit, scale_fit)
bpy.context.view_layer.update()

print("FITTED INNER BAR in world:")
dg = bpy.context.evaluated_depsgraph_get()
for obj in [top, core, bot]:
    eval_obj = obj.evaluated_get(dg)
    bb = [eval_obj.matrix_world @ mathutils.Vector(b) for b in obj.bound_box]
    min_c = [min(v[i] for v in bb) for i in range(3)]
    max_c = [max(v[i] for v in bb) for i in range(3)]
    print(f" {obj.name}: min={min_c}, max={max_c}")

# Check wrap world bounds
w_bb = [wrap.matrix_world @ mathutils.Vector(b) for b in wrap.bound_box]
w_min = [min(v[i] for v in w_bb) for i in range(3)]
w_max = [max(v[i] for v in w_bb) for i in range(3)]
print(f"WRAPPER: min={w_min}, max={w_max}")
