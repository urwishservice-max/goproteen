import bpy, math

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath="public/models/GoProTeen_model.glb")

wrap = bpy.data.objects.get("GoProTeen_Main_Wrapper")

# Hide everything else
for obj in bpy.context.scene.objects:
    if obj != wrap:
        obj.hide_render = True

# Add camera
cam_data = bpy.data.cameras.new("Cam")
cam_obj = bpy.data.objects.new("Cam", cam_data)
bpy.context.scene.collection.objects.link(cam_obj)
bpy.context.scene.camera = cam_obj

# Camera looking at wrap from +Z or +Y
cam_obj.location = (0, -0.4, 0.0)
cam_obj.rotation_euler = (math.radians(90), 0, 0)

# Add sun light
light_data = bpy.data.lights.new("Sun", type="SUN")
light_data.energy = 3.0
light_obj = bpy.data.objects.new("Sun", light_data)
bpy.context.scene.collection.objects.link(light_obj)
light_obj.rotation_euler = (math.radians(45), math.radians(30), 0)

bpy.context.scene.render.resolution_x = 800
bpy.context.scene.render.resolution_y = 400
bpy.context.scene.render.filepath = r"C:\Users\JAIDEV\.gemini\antigravity\brain\d8894f91-ee83-4605-b7aa-0ba46276ab97\check_wrapper_orientation_from_y.png"
bpy.ops.render.render(write_still=True)
print("Rendered wrapper view from -Y")

# Camera looking at wrap from +Z (from above)
cam_obj.location = (0, 0, 0.4)
cam_obj.rotation_euler = (0, 0, 0)
bpy.context.scene.render.filepath = r"C:\Users\JAIDEV\.gemini\antigravity\brain\d8894f91-ee83-4605-b7aa-0ba46276ab97\check_wrapper_orientation_from_z.png"
bpy.ops.render.render(write_still=True)
print("Rendered wrapper view from +Z")
