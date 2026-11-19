import bpy
import os

blend_file = r'E:\Downloads\Models-of-human-anatomy-master\extracted\Z-Anatomy\Z-Anatomy\Startup.blend'
output_glb = r'e:\goproteen website\public\models\z_anatomy_skeleton.glb'

os.makedirs(os.path.dirname(output_glb), exist_ok=True)

# Deselect all
bpy.ops.object.select_all(action='DESELECT')

sk_col = bpy.data.collections.get('1: Skeletal system')
if not sk_col:
    print('Error: 1: Skeletal system not found!')
    exit(1)

renderable_meshes = [
    m for m in sk_col.all_objects 
    if m.type == 'MESH' and not m.hide_render and len(m.data.vertices) > 10
]

print(f'Found {len(renderable_meshes)} renderable skeleton meshes.')

# Assign custom properties for regions
for m in renderable_meshes:
    name_lower = m.name.lower()
    
    # Identify anatomical region
    if any(k in name_lower for k in ['vertebra', 'atlas', 'axis', 'sacrum', 'coccyx', 'intervertebral']):
        m['anatomy_region'] = 'spine'
    elif any(k in name_lower for k in ['hip bone', 'ilium', 'ischium', 'pubis', 'pelvis']):
        m['anatomy_region'] = 'hip'
    elif any(k in name_lower for k in ['patella', 'meniscus']):
        m['anatomy_region'] = 'knee'
    elif any(k in name_lower for k in ['femur']):
        m['anatomy_region'] = 'femur'
    elif any(k in name_lower for k in ['tibia', 'fibula']):
        m['anatomy_region'] = 'lower_leg'
    elif any(k in name_lower for k in ['skull', 'cranium', 'frontal', 'parietal', 'temporal', 'occipital', 'mandible', 'maxilla', 'sphenoid', 'ethmoid', 'zygomatic', 'nasal', 'lacrimal', 'palatine', 'vomer', 'concha', 'hyoid', 'tooth', 'teeth']):
        m['anatomy_region'] = 'skull'
    elif any(k in name_lower for k in ['rib', 'sternum', 'costal']):
        m['anatomy_region'] = 'thorax'
    elif any(k in name_lower for k in ['scapula', 'clavicle', 'humerus', 'radius', 'ulna']):
        m['anatomy_region'] = 'arm'
    elif any(k in name_lower for k in ['carpal', 'metacarpal', 'phalanx', 'hand']):
        m['anatomy_region'] = 'hand'
    elif any(k in name_lower for k in ['tarsal', 'metatarsal', 'talus', 'calcaneus', 'foot']):
        m['anatomy_region'] = 'foot'
    else:
        m['anatomy_region'] = 'other'
        
    m.select_set(True)

# Create an ivory bone PBR material for clean realistic appearance
bone_mat = bpy.data.materials.new(name="IvoryBoneMaterial")
nodes = bone_mat.node_tree.nodes
bsdf = nodes.get("Principled BSDF")
if bsdf:
    # Warm ivory bone color
    bsdf.inputs['Base Color'].default_value = (0.92, 0.88, 0.82, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.45

# Assign material to all renderable meshes
for m in renderable_meshes:
    m.data.materials.clear()
    m.data.materials.append(bone_mat)

print(f'Exporting {len(renderable_meshes)} meshes to {output_glb}...')

# Export GLB with selection only, extras (custom properties) enabled
bpy.ops.export_scene.gltf(
    filepath=output_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_yup=True,
    export_extras=True,
    export_materials='EXPORT'
)

size_mb = os.path.getsize(output_glb) / (1024 * 1024)
print(f'Successfully exported GLB! Size: {size_mb:.2f} MB')
