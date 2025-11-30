import os
import json
import random

# --- CONFIGURATION ---
# 1. Place this script in the ROOT of your project (next to package.json)
# 2. Put your songs and images in the 'public/music' folder (create it if missing)
MUSIC_FOLDER_PATH = "public/music" 
WEB_PATH_PREFIX = "/music/" # This is how the website sees the folder
OUTPUT_FILE = "src/database.js" # This will write directly to your src folder

def generate_database():
    songs = []
    id_counter = 1
    
    # Fallback covers if no image is found
    placeholders = [
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000",
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
        "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000"
    ]

    print(f"Scanning '{MUSIC_FOLDER_PATH}' for music...")

    if not os.path.exists(MUSIC_FOLDER_PATH):
        print(f"Error: Folder '{MUSIC_FOLDER_PATH}' does not exist.")
        print("Please create a folder named 'public/music' and put your songs there.")
        return

    # Get list of files
    files = os.listdir(MUSIC_FOLDER_PATH)
    
    for filename in files:
        if filename.endswith(".mp3"):
            base_name = os.path.splitext(filename)[0]
            
            # 1. Parse Artist and Title
            # Expects format: "Artist Name - Song Title.mp3"
            name_parts = base_name.split(" - ")
            if len(name_parts) >= 2:
                artist = name_parts[0].strip()
                title = name_parts[1].strip()
            else:
                artist = "Unknown Artist"
                title = base_name.strip()

            # 2. Look for matching cover image
            # Checks for "Song Name.jpg" or "Song Name.png"
            cover_url = random.choice(placeholders) # Default to random
            
            possible_covers = [f"{base_name}.jpg", f"{base_name}.jpeg", f"{base_name}.png"]
            for cover_file in possible_covers:
                if cover_file in files:
                    cover_url = f"{WEB_PATH_PREFIX}{cover_file}"
                    print(f"Found cover for {title}: {cover_file}")
                    break

            songs.append({
                "id": id_counter,
                "category": "My Music", 
                "title": title,
                "artist": artist,
                "cover": cover_url,
                "audioUrl": f"{WEB_PATH_PREFIX}{filename}", 
                "color": "from-purple-900 to-black", # Default gradient
                "lyrics": []
            })
            id_counter += 1

    # Write to database.js
    js_content = f"export const songs = {json.dumps(songs, indent=2)};"
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Done! Added {len(songs)} songs to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_database()