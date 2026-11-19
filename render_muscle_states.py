import bpy
import os
import math

glb_path = r"E:\goproteen website\public\models\anatomical_arm.glb"
artifact_dir = r"C:\Users\JAIDEV\.gemini\antigravity\brain\d8894f91-ee83-4605-b7aa-0ba46276ab97"
os.makedirs(artifact_dir, exist_ok=True)

# 1. Clear scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# 2. Import GLB
bpy.ops.import_scene.gltf(filepath=glb_path)

# Find deformable meshes and all arm meshes
deformable_meshes = []
for obj in bpy.data.objects:
    if obj.type == 'MESH' and obj.data.shape_keys:
        if 'MuscleLoss' in obj.data.shape_keys.key_blocks:
            deformable_meshes.append(obj)

print(f"Found {len(deformable_meshes)} deformable muscle meshes.")

# Create an Arm Group and rotate/scale to match Three.js presentation
# In Three.js: armGroup.rotation.set(-0.12, 0.32, 1.45), scale 1.40
parent_empty = bpy.data.objects.new("ArmParent", None)
bpy.context.scene.collection.objects.link(parent_empty)

for obj in list(bpy.data.objects):
    if obj != parent_empty:
        obj.parent = parent_empty

parent_empty.rotation_euler = (-0.12, 0.32, 1.45)
parent_empty.scale = (1.40, 1.40, 1.40)

# Setup Camera
cam_data = bpy.data.cameras.new("RenderCam")
cam_data.lens = 55
cam_obj = bpy.data.objects.new("RenderCam", cam_data)
bpy.context.scene.collection.objects.link(cam_obj)
bpy.context.scene.camera = cam_obj
cam_obj.location = (0.0, -0.78, 0.05)
cam_obj.rotation_euler = (math.radians(88), 0.0, 0.0)

# Setup Lighting
light_data = bpy.data.lights.new(name="KeyLight", type='POINT')
light_data.energy = 180
light_obj = bpy.data.objects.new(name="KeyLight", object_data=light_data)
bpy.context.scene.collection.objects.link(light_obj)
light_obj.location = (0.6, -1.0, 0.8)

fill_data = bpy.data.lights.new(name="FillLight", type='POINT')
fill_data.energy = 80
fill_obj = bpy.data.objects.new(name="FillLight", object_data=fill_data)
bpy.context.scene.collection.objects.link(fill_obj)
fill_obj.location = (-0.8, -0.6, 0.4)

# Render settings
scene = bpy.context.scene
scene.render.resolution_x = 720
scene.render.resolution_y = 480
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'

test_states = [
    (30, 0.00, "Full thick baseline muscles"),
    (40, 0.25, "Noticeably thinner muscle bellies"),
    (50, 0.65, "Clearly thinner biceps, triceps, forearm"),
    (60, 1.00, "Significantly reduced muscle volume"),
]

output_files = []

for age, influence, desc in test_states:
    # Set shape key influence
    for obj in deformable_meshes:
        kb = obj.data.shape_keys.key_blocks.get("MuscleLoss")
        if kb:
            kb.value = influence

    out_file = os.path.join(artifact_dir, f"arm_age_{age}.png")
    scene.render.filepath = out_file
    bpy.ops.render.render(write_still=True)
    output_files.append(out_file)
    print(f"Rendered Age {age} ({desc}) -> {out_file}")

print("All 4 states successfully rendered.")
