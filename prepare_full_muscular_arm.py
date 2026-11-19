import bpy
import math
import os
from mathutils import Vector

out_glb = r"E:\goproteen website\public\models\anatomical_arm.glb"
os.makedirs(os.path.dirname(out_glb), exist_ok=True)

print("Starting generation of thick muscular arm with Sarcopenia morph targets...")

bpy.ops.object.select_all(action='DESELECT')

# 1. Target Deformable Muscles
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
    'Scaphoid bone.r',
    'Lunate bone.r',
    'Triquetrum bone.r',
    'Pisiform bone.r',
    'Trapezium bone.r',
    'Trapezoid bone.r',
    'Capitate bone.r',
    'Hamate bone.r',
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
        print(f"Warning: Object '{name}' not found.")

print(f"Found {len(arm_objs)} arm objects.")

# Global Arm Center
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
print(f"Original Arm Center: {center}")

# Setup materials
mat_muscle = bpy.data.materials.new(name="PBR_Muscle")
mat_muscle.use_nodes = True
bsdf_m = mat_muscle.node_tree.nodes.get("Principled BSDF")
if bsdf_m:
    # Rich deep crimson muscle tone
    bsdf_m.inputs["Base Color"].default_value = (0.76, 0.22, 0.20, 1.0)
    bsdf_m.inputs["Roughness"].default_value = 0.38

mat_bone = bpy.data.materials.new(name="PBR_Bone")
mat_bone.use_nodes = True
bsdf_b = mat_bone.node_tree.nodes.get("Principled BSDF")
if bsdf_b:
    # Clean cortical ivory bone tone
    bsdf_b.inputs["Base Color"].default_value = (0.92, 0.89, 0.83, 1.0)
    bsdf_b.inputs["Roughness"].default_value = 0.28

# Process each object
for obj in arm_objs:
    is_target_muscle = obj.name in target_muscles
    is_hand_muscle = obj.name in hand_muscles

    obj.data.materials.clear()
    if is_target_muscle or is_hand_muscle:
        obj.data.materials.append(mat_muscle)
    else:
        obj.data.materials.append(mat_bone)

    # Clear existing shape keys
    if obj.data.shape_keys:
        for kb in list(obj.data.shape_keys.key_blocks):
            obj.shape_key_remove(kb)

    if is_target_muscle:
        verts = obj.data.vertices
        n_verts = len(verts)

        if n_verts > 0:
            z_coords = [v.co.z for v in verts]
            z_min, z_max = min(z_coords), max(z_coords)
            z_range = z_max - z_min if z_max > z_min else 1.0

            x_coords = [v.co.x for v in verts]
            y_coords = [v.co.y for v in verts]
            obj_cx = (min(x_coords) + max(x_coords)) / 2.0
            obj_cy = (min(y_coords) + max(y_coords)) / 2.0

            name_lower = obj.name.lower()
            if "biceps" in name_lower:
                base_boost = 0.020  # +20mm baseline hypertrophy
                loss_amount = 0.034 # -34mm sarcopenic atrophy
            elif "triceps" in name_lower:
                base_boost = 0.018
                loss_amount = 0.030
            elif "brachialis" in name_lower:
                base_boost = 0.015
                loss_amount = 0.025
            else: # forearm muscles
                base_boost = 0.014
                loss_amount = 0.024

            # 1. First, build the Thick Muscular Baseline (Age 30) into the base vertices!
            # Store original coordinates and compute displacement directions
            disp_dirs = []
            weights = []
            radial_dists = []

            for i, v in enumerate(verts):
                t = (v.co.z - z_min) / z_range
                # Sinusoidal bell curve: strictly 0 at tendon ends, 1 at belly midpoint
                w = math.sin(max(0.0, min(1.0, t)) * math.pi) ** 1.2
                weights.append(w)

                rx = v.co.x - obj_cx
                ry = v.co.y - obj_cy
                r_dist = math.sqrt(rx * rx + ry * ry)
                radial_dists.append(r_dist)

                if r_dist > 0.0005:
                    r_dir = Vector((rx / r_dist, ry / r_dist, 0.0))
                else:
                    r_dir = Vector((0.0, 1.0, 0.0))

                norm = v.normal.normalized() if v.normal.length > 0.001 else r_dir
                blend_dir = (r_dir * 0.70 + norm * 0.30).normalized()
                disp_dirs.append(blend_dir)

                # Expand base vertex to thick muscular state for Age 30
                v.co += blend_dir * (base_boost * w)

            # Update mesh data so normals recalculate
            obj.data.update()

            # 2. Add Basis shape key (now represents full, thick Age 30 muscular arm!)
            obj.shape_key_add(name="Basis")

            # 3. Add MuscleLoss shape key (morphs from thick Age 30 to atrophied Age 60)
            sk_loss = obj.shape_key_add(name="MuscleLoss")

            for i, v in enumerate(verts):
                w = weights[i]
                b_dir = disp_dirs[i]
                r_dist = radial_dists[i]

                # Safe inward contraction
                shrink_dist = min(loss_amount, r_dist * 0.65) * w
                sk_loss.data[i].co = v.co - b_dir * shrink_dist

# Center the arm objects at (0, 0, 0)
for obj in arm_objs:
    obj.location -= center

bpy.context.view_layer.update()

# Select all arm objects
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
