import bpy
import bmesh
import mathutils
import math
import os
import random

output_glb = r'e:\goproteen website\public\models\femur_cutaway.glb'
os.makedirs(os.path.dirname(output_glb), exist_ok=True)

# 1. Deselect everything in the scene
bpy.ops.object.select_all(action='DESELECT')

# 2. Get Femur.r from Startup.blend
femur_orig = bpy.data.objects.get('Femur.r')
if not femur_orig:
    print('Error: Femur.r not found in Startup.blend!')
    exit(1)

# Duplicate Femur.r
bpy.context.view_layer.objects.active = femur_orig
femur_orig.select_set(True)
bpy.ops.object.duplicate(linked=False)
femur = bpy.context.active_object
femur.name = 'Femur_Cortical'

# Link to master scene collection
for col in femur.users_collection:
    col.objects.unlink(femur)
bpy.context.scene.collection.objects.link(femur)

bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

# Center bounding box exactly at (0, 0, 0)
bbox = [femur.matrix_world @ mathutils.Vector(c) for c in femur.bound_box]
center = sum(bbox, mathutils.Vector((0, 0, 0))) / 8.0
femur.location = -center
bpy.ops.object.transform_apply(location=True)

print("Femur_Cortical centered. BBox dimensions:", femur.dimensions)

# 3. Create Anatomical Cutaway Window
# Preserves 100% of the posterior cortical wall and lateral/medial borders
# Ensures bone remains ONE continuous connected structural mesh!
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
cutter = bpy.context.active_object
cutter.name = 'Femur_Cutter'
cutter.scale = (0.058, 0.035, 0.110)
cutter.location = (-0.005, -0.028, 0.118)
bpy.ops.object.transform_apply(location=True, scale=True)

bev = cutter.modifiers.new(name="Bevel", type='BEVEL')
bev.width = 0.018
bev.segments = 6
bpy.ops.object.modifier_apply(modifier="Bevel")

# Apply Boolean difference
bool_mod = femur.modifiers.new(name="Cutaway_Bool", type='BOOLEAN')
bool_mod.operation = 'DIFFERENCE'
bool_mod.object = cutter
bool_mod.solver = 'EXACT'
bpy.context.view_layer.objects.active = femur
bpy.ops.object.modifier_apply(modifier="Cutaway_Bool")

bpy.data.objects.remove(cutter, do_unlink=True)

print("Femur_Cortical cutaway ready:", len(femur.data.vertices), "vertices")

# Cortical Ivory Bone Material
cortical_mat = bpy.data.materials.new(name='Cortical_Bone_Mat')
cortical_mat.use_nodes = True
nodes = cortical_mat.node_tree.nodes
nodes.clear()
out_n = nodes.new(type='ShaderNodeOutputMaterial')
bsdf_n = nodes.new(type='ShaderNodeBsdfPrincipled')
# Natural warm ivory compact bone tone
bsdf_n.inputs['Base Color'].default_value = (0.90, 0.85, 0.78, 1.0)
bsdf_n.inputs['Roughness'].default_value = 0.52
cortical_mat.node_tree.links.new(bsdf_n.outputs['BSDF'], out_n.inputs['Surface'])

femur.data.materials.clear()
femur.data.materials.append(cortical_mat)

# 4. Generate 3D Trabecular Lattice Inside Cutaway Cavity
# Strategically distributed inside the cutaway window
random.seed(42)
nodes_data = []

# Region A: Compressive Trabecular Arc (Neck to Femoral Head)
for t in range(28):
    alpha = t / 27.0
    x = -0.010 + alpha * 0.032 + random.uniform(-0.002, 0.002)
    y = -0.024 + alpha * 0.004 + random.uniform(-0.003, 0.003)
    z = 0.108 + alpha * 0.052 + random.uniform(-0.002, 0.002)
    nodes_data.append(mathutils.Vector((x, y, z)))

# Region B: Greater Trochanter Spongy Zone (Tensile group)
for _ in range(26):
    x = random.uniform(-0.030, -0.012)
    y = random.uniform(-0.026, -0.014)
    z = random.uniform(0.105, 0.155)
    nodes_data.append(mathutils.Vector((x, y, z)))

# Region C: Proximal Diaphyseal Marrow Cavity
for _ in range(28):
    x = random.uniform(-0.014, 0.006)
    y = random.uniform(-0.026, -0.014)
    z = random.uniform(0.068, 0.115)
    nodes_data.append(mathutils.Vector((x, y, z)))

# Region D: Ward's Triangle & Inter-trochanteric Matrix
for _ in range(26):
    x = random.uniform(-0.014, 0.014)
    y = random.uniform(-0.025, -0.014)
    z = random.uniform(0.092, 0.138)
    nodes_data.append(mathutils.Vector((x, y, z)))

# Region E: Medial Subchondral Cluster
for _ in range(16):
    x = random.uniform(0.006, 0.024)
    y = random.uniform(-0.023, -0.014)
    z = random.uniform(0.128, 0.160)
    nodes_data.append(mathutils.Vector((x, y, z)))

print(f"Total trabecular seed nodes: {len(nodes_data)}")

# Connect nearby nodes into 3D structural struts
edges = set()
for i, n1 in enumerate(nodes_data):
    dists = []
    for j, n2 in enumerate(nodes_data):
        if i == j: continue
        d = (n1 - n2).length
        if d < 0.022:
            dists.append((d, j))
    dists.sort()
    for d, j in dists[:5]:
        edges.add((min(i, j), max(i, j)))

print(f"Total trabecular struts (edges): {len(edges)}")

bm = bmesh.new()
strut_data = [] # (v_co, center_pt, norm_dir, orig_pt)
r_base = 0.0016 # Age 30: 1.6mm thick robust interconnected struts

for (i1, i2) in edges:
    p1 = nodes_data[i1]
    p2 = nodes_data[i2]
    vec = p2 - p1
    length = vec.length
    if length < 0.001: continue
    
    dir_z = vec.normalized()
    temp = mathutils.Vector((0, 0, 1)) if abs(dir_z.z) < 0.9 else mathutils.Vector((1, 0, 0))
    dir_x = dir_z.cross(temp).normalized()
    dir_y = dir_z.cross(dir_x).normalized()
    
    center_pt = (p1 + p2) * 0.5
    
    # 6-sided cross section for cylindrical strut
    n_sides = 6
    v_top = []
    v_bot = []
    
    for s in range(n_sides):
        angle = 2 * math.pi * s / n_sides
        offset = (dir_x * math.cos(angle) + dir_y * math.sin(angle)) * r_base
        norm_dir = (dir_x * math.cos(angle) + dir_y * math.sin(angle)).normalized()
        
        vt = bm.verts.new(p2 + offset)
        vb = bm.verts.new(p1 + offset)
        v_top.append(vt)
        v_bot.append(vb)
        
        strut_data.append((vt, center_pt, norm_dir, p2))
        strut_data.append((vb, center_pt, norm_dir, p1))
    
    # Create quad faces along the strut tube
    for s in range(n_sides):
        s_next = (s + 1) % n_sides
        try:
            bm.faces.new([v_bot[s], v_bot[s_next], v_top[s_next], v_top[s]])
        except Exception:
            pass

bm.verts.ensure_lookup_table()
bm.faces.ensure_lookup_table()

# Create Trabecular Mesh Object
trab_mesh = bpy.data.meshes.new('Trabecular_Honeycomb_Mesh')
bm.to_mesh(trab_mesh)
bm.free()

trab_obj = bpy.data.objects.new('Trabecular_Honeycomb', trab_mesh)
bpy.context.scene.collection.objects.link(trab_obj)

# Trabecular Material (Rich warm honey-ivory tone)
trab_mat = bpy.data.materials.new(name='Trabecular_Spongy_Mat')
trab_mat.use_nodes = True
nodes = trab_mat.node_tree.nodes
nodes.clear()
out_n = nodes.new(type='ShaderNodeOutputMaterial')
bsdf_n = nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf_n.inputs['Base Color'].default_value = (0.78, 0.62, 0.42, 1.0)
bsdf_n.inputs['Roughness'].default_value = 0.58
trab_mat.node_tree.links.new(bsdf_n.outputs['BSDF'], out_n.inputs['Surface'])

trab_obj.data.materials.append(trab_mat)

# 5. Add Shape Keys for Continuous Age-based Deformation (Age 30 to 60)
bpy.context.view_layer.objects.active = trab_obj
trab_obj.select_set(True)

# Base Shape Key: Age 30 (Dense trabecular structure, 100% thickness)
base_sk = trab_obj.shape_key_add(name='Age30_Dense', from_mix=False)

# Shape Key 1: Age 40 (Slightly thinner trabeculae, 70% thickness)
sk_40 = trab_obj.shape_key_add(name='Age40_Thinning', from_mix=False)
for idx, (v_elem, center_pt, norm_dir, orig_pt) in enumerate(strut_data):
    radial_vec = norm_dir * (r_base * 0.70)
    sk_40.data[idx].co = orig_pt + radial_vec

# Shape Key 2: Age 50 (Clearly reduced trabeculae, 45% thickness)
sk_50 = trab_obj.shape_key_add(name='Age50_Porous', from_mix=False)
for idx, (v_elem, center_pt, norm_dir, orig_pt) in enumerate(strut_data):
    radial_vec = norm_dir * (r_base * 0.45)
    sk_50.data[idx].co = orig_pt + radial_vec

# Shape Key 3: Age 60 (Advanced porosity, 22% thickness)
sk_60 = trab_obj.shape_key_add(name='Age60_AdvancedPorosity', from_mix=False)
for idx, (v_elem, center_pt, norm_dir, orig_pt) in enumerate(strut_data):
    radial_vec = norm_dir * (r_base * 0.22)
    sk_60.data[idx].co = orig_pt + radial_vec

print("Shape keys created successfully on Trabecular mesh.")

# 6. Export Final Glb with Both Cortical Femur & Trabecular Lattice
bpy.ops.object.select_all(action='DESELECT')
femur.select_set(True)
trab_obj.select_set(True)
bpy.context.view_layer.objects.active = femur

bpy.ops.export_scene.gltf(
    filepath=output_glb,
    use_selection=True,
    export_format='GLB',
    export_morph=True,
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False,
    export_apply=False
)

# Also copy to root models folder
root_copy = r'e:\goproteen website\models\femur_cutaway.glb'
os.makedirs(os.path.dirname(root_copy), exist_ok=True)
import shutil
shutil.copy2(output_glb, root_copy)

print(f"SUCCESS: Exported femur cutaway with trabecular lattice to {output_glb} and {root_copy}")
print(f"File size: {os.path.getsize(output_glb) / 1024:.1f} KB")
