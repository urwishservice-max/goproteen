import bpy
import bmesh
import mathutils
import math
import os

blend_file = r'E:\Downloads\Models-of-human-anatomy-master\extracted\Z-Anatomy\Z-Anatomy\Startup.blend'
output_glb = r'e:\goproteen website\public\models\femur_cutaway.glb'

# Reset scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Append Femur.r and materials from Startup.blend
with bpy.data.libraries.load(blend_file) as (data_from, data_to):
    if 'Femur.r' in data_from.objects:
        data_to.objects = ['Femur.r']

femur_orig = bpy.data.objects.get('Femur.r')
if not femur_orig:
    print('Error: Femur.r not found!')
    exit(1)

bpy.context.collection.objects.link(femur_orig)
femur_orig.select_set(True)
bpy.context.view_layer.objects.active = femur_orig

# Apply transforms so it is aligned nicely
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

print('Femur dimensions:', femur_orig.dimensions)
print('Femur location:', femur_orig.location)

# Center the femur: center of bounding box at (0, 0, 0)
bbox_corners = [femur_orig.matrix_world @ mathutils.Vector(c) for c in femur_orig.bound_box]
center = sum(bbox_corners, mathutils.Vector((0, 0, 0))) / 8.0
femur_orig.location = -center
bpy.ops.object.transform_apply(location=True)

print('Femur centered at origin. New bbox min/max:')
min_co = mathutils.Vector((min(c.x for c in bbox_corners), min(c.y for c in bbox_corners), min(c.z for c in bbox_corners))) - center
max_co = mathutils.Vector((max(c.x for c in bbox_corners), max(c.y for c in bbox_corners), max(c.z for c in bbox_corners))) - center
print('Min:', min_co)
print('Max:', max_co)
