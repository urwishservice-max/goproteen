import bpy
import math
import os
from mathutils import Vector

out_glb = r"E:\goproteen website\public\models\anatomical_arm.glb"
os.makedirs(os.path.dirname(out_glb), exist_ok=True)

print("Starting direct export of anatomical arm from Startup.blend...")

# Deselect everything first
bpy.ops.object.select_all(action='DESELECT')

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

all_arm_names = target_muscles + hand_muscles + rigid_bones

arm_objs = []
for name in all_arm_names:
    obj = bpy.data.objects.get(name)
    if obj and obj.type == 'MESH':
        arm_objs.append(obj)
    else:
        print(f"Warning: Object '{name}' not found or not mesh.")

print(f"Found {len(arm_objs)} arm mesh objects in scene.")

# Calculate bounding box
all_world_pts = []
for obj in arm_objs:
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
print(f"Arm Center: {center}")
print(f"Arm Dimensions: ({max_x - min_x:.3f}, {max_y - min_y:.3f}, {max_z - min_z:.3f})")

# Setup clean materials for muscles and bones
mat_muscle = bpy.data.materials.new(name="PBR_Muscle")
mat_muscle.use_nodes = True
bsdf_m = mat_muscle.node_tree.nodes.get("Principled BSDF")
if bsdf_m:
    # Rich muscle crimson PBR tone
    bsdf_m.inputs["Base Color"].default_value = (0.75, 0.22, 0.20, 1.0)
    bsdf_m.inputs["Roughness"].default_value = 0.38

mat_bone = bpy.data.materials.new(name="PBR_Bone")
mat_bone.use_nodes = True
bsdf_b = mat_bone.node_tree.nodes.get("Principled BSDF")
if bsdf_b:
    # Ivory cortical bone PBR tone
    bsdf_b.inputs["Base Color"].default_value = (0.92, 0.89, 0.83, 1.0)
    bsdf_b.inputs["Roughness"].default_value = 0.28

# Create Shape Keys on Target Muscles
for obj in arm_objs:
    is_target_muscle = obj.name in target_muscles
    is_hand_muscle = obj.name in hand_muscles

    # Clean materials
    obj.data.materials.clear()
    if is_target_muscle or is_hand_muscle:
        obj.data.materials.append(mat_muscle)
    else:
        obj.data.materials.append(mat_bone)

    if is_target_muscle:
        # Create Basis shape key
        if not obj.data.shape_keys:
            obj.shape_key_add(name="Basis")

        verts = obj.data.vertices
        if len(verts) > 0:
            z_coords = [v.co.z for v in verts]
            z_min, z_max = min(z_coords), max(z_coords)
            z_range = z_max - z_min if z_max > z_min else 1.0

            # Remove existing keys if any
            if "MuscleLoss" in obj.data.shape_keys.key_blocks:
                obj.shape_key_remove(obj.data.shape_keys.key_blocks["MuscleLoss"])
            if "MuscleGain" in obj.data.shape_keys.key_blocks:
                obj.shape_key_remove(obj.data.shape_keys.key_blocks["MuscleGain"])

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
            else: # forearm
                loss_scale = 0.006
                gain_scale = 0.005

            for i, v in enumerate(verts):
                t = (v.co.z - z_min) / z_range
                # Sinusoidal bell curve: strictly 0 at tendon ends, 1.0 in belly
                w = math.sin(max(0.0, min(1.0, t)) * math.pi) ** 1.6
                disp = v.normal * w
                sk_loss.data[i].co = v.co - disp * loss_scale
                sk_gain.data[i].co = v.co + disp * gain_scale

# Center the arm objects at (0, 0, 0)
for obj in arm_objs:
    obj.location -= center

bpy.context.view_layer.update()

# Select all arm objects and activate one
bpy.ops.object.select_all(action='DESELECT')
for obj in arm_objs:
    obj.select_set(True)

bpy.context.view_layer.objects.active = arm_objs[0]

print(f"Exporting {len(arm_objs)} objects to {out_glb}...")
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=False,
    export_morph=True,
    export_morph_normal=True,
    export_materials='EXPORT',
    export_yup=True
)

sz_mb = os.path.getsize(out_glb) / (1024 * 1024)
print(f"SUCCESS: Exported {out_glb} ({sz_mb:.2f} MB)")
