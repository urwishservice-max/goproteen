import bpy, math

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath="public/models/GoProTeen_model.glb")

wrap = bpy.data.objects.get("GoProTeen_Main_Wrapper")
ctrl = bpy.data.objects.get("GP_EXPLODE_CONTROLLER")

print("BEFORE:")
print("Wrap dims:", wrap.dimensions)
print("Ctrl dims:", ctrl.dimensions)

# The wrapper in Blender has:
# X: 0.1449 (Length)
# Y: 0.0137 (Thickness)
# Z: 0.0270 (Width)

# Let's check how the inner bar should be oriented to match the wrapper:
# If ctrl has:
# X: Length
# Y: Width (0.0280)
# Z: Thickness (0.0127)

# To align ctrl with wrap:
# Width of ctrl (currently Y) needs to align with Width of wrap (Z).
# Thickness of ctrl (currently Z) needs to align with Thickness of wrap (Y).
# A rotation of 90 degrees around X aligns them!
ctrl.rotation_euler.x = math.radians(90)
bpy.context.view_layer.update()

print("AFTER ROTATING CTRL 90 deg around X:")
print("Wrap dims:", wrap.dimensions)
print("Ctrl dims:", ctrl.dimensions)
