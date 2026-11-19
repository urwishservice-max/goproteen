from PIL import Image, ImageDraw, ImageFont
import os

artifact_dir = r"C:\Users\JAIDEV\.gemini\antigravity\brain\d8894f91-ee83-4605-b7aa-0ba46276ab97"

img_30 = Image.open(os.path.join(artifact_dir, "arm_age_30.png"))
img_40 = Image.open(os.path.join(artifact_dir, "arm_age_40.png"))
img_50 = Image.open(os.path.join(artifact_dir, "arm_age_50.png"))
img_60 = Image.open(os.path.join(artifact_dir, "arm_age_60.png"))

w, h = img_30.size # 720 x 480

# 2x2 grid or 1x4 horizontal comparison:
# 1x4 horizontal gives great direct side-by-side:
canvas_w = w * 4
canvas_h = h + 120

# Background warm cream matching site
bg_color = (247, 245, 240)
comp = Image.new("RGB", (canvas_w, canvas_h), bg_color)

draw = ImageDraw.Draw(comp)

panels = [
    (img_30, 0, "AGE 30", "Full Baseline Muscles (0% Loss)"),
    (img_40, 1, "AGE 40", "Noticeably Thinner Bellies (~10% Loss)"),
    (img_50, 2, "AGE 50", "Clearly Reduced Volume (~40% Loss)"),
    (img_60, 3, "AGE 60", "Significant Sarcopenia (~50% Loss)"),
]

for img, idx, title, subtitle in panels:
    x_offset = idx * w
    # Paste transparent PNG over warm cream
    comp.paste(img, (x_offset, 100), img)
    
    # Title & Subtitle
    # Draw simple clean text
    draw.text((x_offset + 30, 35), title, fill=(20, 9, 31))
    draw.text((x_offset + 30, 60), subtitle, fill=(107, 114, 108))

out_path = os.path.join(artifact_dir, "muscle_progression_comparison_30_to_60.png")
comp.save(out_path, "PNG")
print(f"Created comparison artifact: {out_path}")
