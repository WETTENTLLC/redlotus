from PIL import Image

# Create a horizontal stripe image with the lotus gradient colors
width = 1200
height = 50

img = Image.new('RGB', (width, height))
pixels = img.load()

colors = [
    (183, 28, 28),      # Red #b71c1c
    (251, 192, 45),     # Yellow #fbc02d
    (25, 118, 210),     # Blue #1976d2
    (56, 142, 60),      # Green #388e3c
    (194, 24, 91),      # Pink #c2185b
]

for x in range(width):
    segment_width = width // len(colors)
    segment_index = min(x // segment_width, len(colors) - 1)
    progress = (x % segment_width) / segment_width
    
    current_color = colors[segment_index]
    next_color = colors[min(segment_index + 1, len(colors) - 1)]
    
    r = int(current_color[0] * (1 - progress) + next_color[0] * progress)
    g = int(current_color[1] * (1 - progress) + next_color[1] * progress)
    b = int(current_color[2] * (1 - progress) + next_color[2] * progress)
    
    for y in range(height):
        pixels[x, y] = (r, g, b)

img.save('./src/assets/header-accent-stripe.png', 'PNG')
print("✓ Created header-accent-stripe.png (1200x50px)")
