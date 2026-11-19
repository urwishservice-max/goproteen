import bpy
import math
import os
from mathutils import Vector, Euler

src_blend = r"E:\Downloads\Models-of-human-anatomy-master\extracted\Z-Anatomy\Z-Anatomy\Startup.blend"
out_glb = r"E:\goproteen website\public\models\anatomical_arm.glb"
out_dir = os.path.dirname(out_glb)
os.makedirs(out_dir, exist_ok=True)

print("Starting anatomical arm extraction...")

# Reset Blender
bpy.ops.wm.read_factory_settings(use_empty=True)

# 1. Target Deformable Muscles (Only bellies deform; tendons stay locked)
target_muscles = [
    'Long head of biceps brachii.r',
    'Short head of biceps brachii.r',
    'Brachialis muscle.r',
    'Coracobrachialis muscle.r',
    'Long head of triceps brachii.r',
    'Lateral head of triceps brachii.r',
    'Medial head of triceps brachii.r',
    'Brachioradialis muscle.r',
    'Superficial head of pronator teres.r',
    'Deep head of pronator teres.r',
    'Flexor carpi radialis.r',
    'Humeral head of flexor carpi ulnaris.r',
    'Ulnar head of flexor carpi ulnaris.r',
    'Extensor carpi radialis longus.r',
    'Extensor carpi radialis brevis.r',
    'Extensor digitorum.r',
    'Anconeus muscle.r',
    'Supinator.r',
]

# 2. Hand & Finger muscles (rigid, fixed)
hand_muscles = [
    'Abductor pollicis brevis.r',
    'Abductor digiti minimi of hand.r',
]

# 3. Rigid Bones (Humerus, Radius, Ulna, Carpals, Metacarpals, Phalanges)
rigid_bones = [
    'Humerus.r',
    'Radius.r',
    'Ulna.r',
    # Carpals (Wrist)
    'Scaphoid bone.r',
    'Lunate bone.r',
    'Triquetrum bone.r',
    'Pisiform bone.r',
    'Trapezium bone.r',
    'Trapezoid bone.r',
    'Capitate bone.r',
    'Hamate bone.r',
    # Metacarpals (Palm)
    'First metacarpal bone.r',
    'Second metacarpal bone.r',
    'Third metacarpal bone.r',
    'Fourth metacarpal bone.r',
    'Fifth metacarpal bone.r',
]

finger_names = ['first', 'second', 'third', 'fourth', 'fifth']
for f in finger_names:
    for seg in ['Proximal', 'Middle', 'Distal']:
        if f == 'first' and seg == 'Middle':
            continue
        rigid_bones.append(f'{seg} phalanx of {f} finger of hand.r')

all_objects_to_import = target_muscles + hand_muscles + rigid_bones

with bpy.data.libraries.load(src_blend, link=False) as (data_from, data_to):
    data_to.objects = [name for name in data_from.objects if name in all_objects_to_import]

# Link objects to active layer collection
imported_objs = []
active_coll = bpy.context.view_layer.active_layer_collection.collection
for obj in data_to.objects:
    if obj:
        active_coll.objects.link(obj)
        imported_objs.append(obj)

bpy.context.view_layer.update()
print(f"Imported {len(imported_objs)} arm objects.")

# Exact bounding box calculation across all vertices
all_world_pts = []
for obj in imported_objs:
    mw = obj.matrix_world
    for v in obj.data.vertices:
        all_world_pts.append(mw @ v.co)

min_x = min(p.x for p in all_world_pts)
max_x = max(p.x for p in all_world_pts)
min_y = min(p.y for p in all_world_pts)
max_y = max(p.y for p in all_world_pts)
min_z = min(p.z for p in all_world_pts)
max_z = max(p.z for p in all_world_pts)

center = Vector(((min_x + max_x)/2, (min_y + max_y)/2, (min_z + max_z)/2))
dimensions = Vector((max_x - min_x, max_y - min_y, max_z - min_z))
print(f"Calculated Arm Center: {center}")
print(f"Arm Dimensions: {dimensions}")

# Materials setup
mat_muscle = bpy.data.materials.new(name="Anatomical_Muscle")
mat_muscle.use_nodes = True
bsdf_m = mat_muscle.node_tree.nodes.get("Principled BSDF")
if bsdf_m:
    # Rich muscle crimson PBR tone
    bsdf_m.inputs["Base Color"].default_value = (0.75, 0.22, 0.20, 1.0)
    bsdf_m.inputs["Roughness"].default_value = 0.38

mat_bone = bpy.data.materials.new(name="Anatomical_Bone")
mat_bone.use_nodes = True
bsdf_b = mat_bone.node_tree.nodes.get("Principled BSDF")
if bsdf_b:
    # Smooth ivory cortical bone PBR tone
    bsdf_b.inputs["Base Color"].default_value = (0.92, 0.89, 0.83, 1.0)
    bsdf_b.inputs["Roughness"].default_value = 0.28

# Create Shape Keys on Target Muscles
for obj in imported_objs:
    obj.data.materials.clear()
    is_target_muscle = obj.name in target_muscles
    is_hand_muscle = obj.name in hand_muscles

    if is_target_muscle or is_hand_muscle:
        obj.data.materials.append(mat_muscle)
    else:
        obj.data.materials.append(mat_bone)

    if is_target_muscle:
        if not obj.data.shape_keys:
            obj.shape_key_add(name="Basis")

        verts = obj.data.vertices
        if len(verts) > 0:
            z_coords = [v.co.z for v in verts]
            z_min, z_max = min(z_coords), max(z_coords)
            z_range = z_max - z_min if z_max > z_min else 1.0

            sk_loss = obj.shape_key_add(name="MuscleLoss")
            sk_gain = obj.shape_key_add(name="MuscleGain")

            if "biceps" in obj.name.lower():
                loss_scale = 0.010
                gain_scale = 0.009
            elif "triceps" in obj.name.lower():
                loss_scale = 0.009
                gain_scale = 0.008
            elif "brachialis" in obj.name.lower():
                loss_scale = 0.008
                gain_scale = 0.007
            else: # forearm muscles
                loss_scale = 0.006
                gain_scale = 0.005

            for i, v in enumerate(verts):
                t = (v.co.z - z_min) / z_range
                # Sinusoidal bell weighting: strictly 0 at tendon ends, 1.0 in belly
                w = math.sin(max(0.0, min(1.0, t)) * math.pi) ** 1.6
                disp = v.normal * w
                sk_loss.data[i].co = v.co - disp * loss_scale
                sk_gain.data[i].co = v.co + disp * gain_scale

            print(f"Created shape keys on {obj.name}")

# Center the arm at the origin (0, 0, 0)
for obj in imported_objs:
    obj.location -= center

bpy.context.view_layer.update()
print("Centered arm at (0, 0, 0).")

# Select all objects for export
bpy.ops.object.select_all(action='DESELECT')
for obj in imported_objs:
    obj.select_set(True)

print(f"Exporting GLB to: {out_glb}...")
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    use_selection=False,
    export_apply=False,
    export_morph=True,
    export_morph_normal=True,
    export_materials='EXPORT',
    export_yup=True
)

sz_mb = os.path.getsize(out_glb) / (1024 * 1024)
print(f"SUCCESS: Exported {out_glb} ({sz_mb:.2f} MB)")
