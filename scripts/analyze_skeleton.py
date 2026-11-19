import bpy
import mathutils

sk_col = bpy.data.collections.get('1: Skeletal system')
if not sk_col:
    print('Skeletal system not found!')
    exit(1)

# All mesh objects in skeletal system
all_objs = list(sk_col.all_objects)
meshes = [o for o in all_objs if o.type == 'MESH']
print(f'Total objects: {len(all_objs)}, Meshes: {len(meshes)}')

# Check which meshes are renderable or have vertices
renderable = [m for m in meshes if not m.hide_render and len(m.data.vertices) > 10]
print(f'Renderable meshes (>10 verts): {len(renderable)}')

# Sample object names
categories = {'spine': [], 'hip': [], 'knee': [], 'skull': [], 'ribs': [], 'arm': [], 'leg': [], 'foot': [], 'hand': [], 'other': []}

for m in renderable:
    name_lower = m.name.lower()
    if any(k in name_lower for k in ['vertebra', 'atlas', 'axis', 'sacrum', 'coccyx', 'intervertebral']):
        categories['spine'].append(m.name)
    elif any(k in name_lower for k in ['hip', 'ilium', 'ischium', 'pubis', 'pelvis']):
        categories['hip'].append(m.name)
    elif any(k in name_lower for k in ['patella', 'femur', 'tibia', 'fibula', 'knee', 'meniscus']):
        categories['knee'].append(m.name)
    elif any(k in name_lower for k in ['skull', 'cranium', 'frontal', 'parietal', 'temporal', 'occipital', 'mandible', 'maxilla', 'sphenoid', 'ethmoid', 'zygomatic', 'nasal', 'lacrimal', 'palatine', 'vomer', 'concha', 'hyoid', 'tooth', 'teeth']):
        categories['skull'].append(m.name)
    elif any(k in name_lower for k in ['rib', 'sternum', 'costal']):
        categories['ribs'].append(m.name)
    elif any(k in name_lower for k in ['scapula', 'clavicle', 'humerus', 'radius', 'ulna']):
        categories['arm'].append(m.name)
    elif any(k in name_lower for k in ['carpal', 'metacarpal', 'phalanx', 'hand']):
        categories['hand'].append(m.name)
    elif any(k in name_lower for k in ['tarsal', 'metatarsal', 'talus', 'calcaneus', 'foot']):
        categories['foot'].append(m.name)
    else:
        categories['other'].append(m.name)

for cat, items in categories.items():
    print(f'Category {cat} ({len(items)}): {items[:5]}...')

# Check bounds
min_co = mathutils.Vector((float('inf'), float('inf'), float('inf')))
max_co = mathutils.Vector((float('-inf'), float('-inf'), float('-inf')))
for o in renderable:
    for corner in o.bound_box:
        world_pt = o.matrix_world @ mathutils.Vector(corner)
        min_co.x = min(min_co.x, world_pt.x)
        min_co.y = min(min_co.y, world_pt.y)
        min_co.z = min(min_co.z, world_pt.z)
        max_co.x = max(max_co.x, world_pt.x)
        max_co.y = max(max_co.y, world_pt.y)
        max_co.z = max(max_co.z, world_pt.z)

print(f'Bounding Box Min: {min_co}')
print(f'Bounding Box Max: {max_co}')
print(f'Dimensions: Width(X)={max_co.x - min_co.x:.3f}m, Depth(Y)={max_co.y - min_co.y:.3f}m, Height(Z)={max_co.z - min_co.z:.3f}m')
print(f'Center: {(min_co + max_co)/2}')
