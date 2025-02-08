from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder(filename, color, text):
    img = Image.new('RGB', (500, 750), color=color)
    draw = ImageDraw.Draw(img)
    
    # Use a default font
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font = ImageFont.load_default()
    
    # Draw text
    draw.text((50, 350), text, fill=(255,255,255), font=font)
    
    # Save image
    img.save(os.path.join('src', 'images', filename))

# Create images directory if it doesn't exist
os.makedirs(os.path.join('src', 'images'), exist_ok=True)

# Generate placeholders
create_placeholder('naruto-hoodie.jpg', '#FF6B6B', 'Naruto Hoodie')
create_placeholder('aot-jacket.jpg', '#4ECDC4', 'AOT Jacket')
create_placeholder('onepiece-tshirt.jpg', '#45B7D1', 'One Piece Tee')

print("Placeholder images generated successfully!")
