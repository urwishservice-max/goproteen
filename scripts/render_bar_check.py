import bpy, math

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath="public/models/GoProTeen_model.glb")

wrap = bpy.data.objects.get("GoProTeen_Main_Wrapper")
ctrl = bpy.data.objects.get("GP_EXPLODE_CONTROLLER")

wrap.hide_render = True

# Add camera
cam_data = bpy.data.cameras.new("Cam")
cam_obj = bpy.data.objects.new("Cam", cam_data)
bpy.context.scene.collection.objects.link(cam_obj)
bpy.context.scene.camera = cam_obj

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
bpy.context.scene.render.filepath = r"C:\Users\JAIDEV\.gemini\antigravity\brain\d8894f91-ee83-4605-b7aa-0ba46276ab97\check_inner_bar_from_y.png"
bpy.ops.render.render(write_still=True)
print("Rendered inner bar from -Y")

# Camera looking from +Z (from above in Blender)
cam_obj.location = (0, 0, 0.4)
cam_obj.rotation_euler = (0, 0, 0)
bpy.context.scene.render.filepath = r"C:\Users\JAIDEV\.gemini\antigravity\brain\d8894f91-ee83-4605-b7aa-0ba46276ab97\check_inner_bar_from_z.png"
bpy.ops.render.render(write_still=True)
print("Rendered inner bar from +Z")
