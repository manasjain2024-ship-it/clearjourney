import zlib
import struct
import os

def create_png(width, height, color_rgb):
    # Minimal PNG generator using standard library zlib
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)) # 8-bit RGB
    
    raw_data = bytearray()
    r, g, b = color_rgb
    for y in range(height):
        raw_data.append(0) # filter type 0 (None)
        for x in range(width):
            # Draw rounded border and sage green background
            dx = abs(x - width / 2) / (width / 2)
            dy = abs(y - height / 2) / (height / 2)
            if dx*dx + dy*dy < 0.8:
                raw_data.extend([r, g, b])
            else:
                raw_data.extend([max(0, r - 30), max(0, g - 30), max(0, b - 30)])
                
    idat = chunk(b'IDAT', zlib.compress(bytes(raw_data)))
    iend = chunk(b'IEND', b'')
    return header + ihdr + idat + iend

out_dir = r"c:\Users\hp\OneDrive\Desktop\Mosaic fellowship\clearjourney\public"
os.makedirs(out_dir, exist_ok=True)

with open(os.path.join(out_dir, "icon-192.png"), "wb") as f:
    f.write(create_png(192, 192, (46, 90, 68))) # Sage green #2E5A44

with open(os.path.join(out_dir, "icon-512.png"), "wb") as f:
    f.write(create_png(512, 512, (46, 90, 68)))

with open(os.path.join(out_dir, "favicon.ico"), "wb") as f:
    # Use 32x32 png as favicon
    f.write(create_png(32, 32, (46, 90, 68)))

print("Icons generated successfully!")
