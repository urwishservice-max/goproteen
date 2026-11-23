import bpy, math
bpy.ops.wm.open_mainfile(filepath='e:/Downloads/GoProTeen_Inside_Ingredients_V3.blend1')
for o in bpy.context.scene.objects:
    if 'CAM' in o.name:
        print(f'{o.name}: loc={o.location}, rot_deg={[math.degrees(r) for r in o.rotation_euler]}')
