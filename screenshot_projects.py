import re, os, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

with open(r'd:\web\Develop\portfolio\data\projects.js', 'r', encoding='utf-8') as f:
    content = f.read()

projects = []
pattern = r"slug:\s*'([^']*)'.*?image:\s*'([^']*)'.*?link:\s*'([^']*)'"
for match in re.finditer(pattern, content, re.DOTALL):
    slug, image, link = match.groups()
    if link:
        projects.append({'slug': slug, 'image': image, 'link': link})

output_dir = r'd:\web\Develop\portfolio\assets\images\projects'
os.makedirs(output_dir, exist_ok=True)

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1920,1200')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--force-device-scale-factor=1')
options.add_argument('--hide-scrollbars')

driver = webdriver.Chrome(options=options)
driver.set_window_size(1920, 1200)

total = len(projects)
print(f'Found {total} projects with links. Starting screenshots...\n', flush=True)

for i, p in enumerate(projects):
    filename = os.path.basename(p['image'])
    # Save as PNG for quality, change extension
    png_filename = os.path.splitext(filename)[0] + '.png'
    filepath = os.path.join(output_dir, png_filename)
    
    if os.path.exists(filepath):
        print(f'[{i+1}/{total}] SKIP {p["slug"]} - already exists', flush=True)
        continue
    
    print(f'[{i+1}/{total}] Capturing {p["slug"]}... ({p["link"]})', flush=True)
    
    try:
        driver.get(p['link'])
        time.sleep(10)
        driver.save_screenshot(filepath)
        size_kb = os.path.getsize(filepath) // 1024
        print(f'         Saved: {png_filename} ({size_kb}KB)', flush=True)
    except Exception as e:
        print(f'         ERROR: {e}', flush=True)

driver.quit()
print(f'\nDone! Screenshots saved to {output_dir}')
