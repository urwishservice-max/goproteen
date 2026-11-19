from PIL import Image, ImageFilter
import os

src_path = r"C:\Users\JAIDEV\.gemini\antigravity\brain\d8894f91-ee83-4605-b7aa-0ba46276ab97\.user_uploaded\media_1794843209442_a49bb92f.jpg"
out_dir = r"E:\goproteen website\public\images"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path)
w, h = img.size

# 1. Muscle background illustration
# Crop from x=280 to 1024, y=0 to 440
muscle_crop = img.crop((int(w * 0.28), 0, w, int(h * 0.88)))
out_muscle = os.path.join(out_dir, "cell_response_muscle.png")
muscle_crop.save(out_muscle, "PNG", quality=95)
print(f"Saved muscle illustration: {out_muscle} ({muscle_crop.size})")

# 2. Extract Leucine protein cluster with transparency
# The protein cluster with halo is around x=332..412, y=124..204
cluster_box = (int(w * 0.328), int(h * 0.258), int(w * 0.408), int(h * 0.428))
cluster_crop = img.crop(cluster_box)

# Convert to RGBA and make outer cream background transparent
rgba_cluster = cluster_crop.convert("RGBA")
pix = rgba_cluster.load()
cw, ch = rgba_cluster.size

# Background cream reference
bg_r, bg_g, bg_b = 251, 241, 239

for y in range(ch):
    for x in range(cw):
        r, g, b, a = pix[x, y]
        # Distance from background cream
        d = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
        if d < 18:
            pix[x, y] = (r, g, b, 0)
        elif d < 38:
            # Smooth alpha feathering
            alpha = int(255 * ((d - 18) / 20.0))
            pix[x, y] = (r, g, b, alpha)

out_leucine = os.path.join(out_dir, "leucine_molecule.png")
rgba_cluster.save(out_leucine, "PNG")
print(f"Saved leucine molecule: {out_leucine} ({rgba_cluster.size})")
