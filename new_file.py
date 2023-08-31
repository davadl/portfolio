import os
import json

# Directory containing images and videos
directory = './imgs'

# Get all files in the directory
files = os.listdir(directory)

# Filter out non-image and non-video files
media_files = [f for f in files if f.endswith(('.png', '.jpg', '.jpeg', '.mp4'))]

# Create a JSON object for each file
images = []
for file in media_files:
    src = f'./imgs/{file}'
    alt = f'Output {file}'
    description = f'Description for {file}'
    type = 'video' if file.endswith('.mp4') else 'image'
    images.append({'src': src, 'alt': alt, 'description': description, 'type': type})

# Write the JSON objects to the image_store.json file
with open('image_store.json', 'w') as f:
    json.dump({'images': images}, f, indent=2)
