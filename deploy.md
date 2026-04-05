# Deploy Guide

## Netlify
1. Create a new site from Git or drag-and-drop the `bakery-shop` folder.
2. Publish directory: `.`
3. `netlify.toml` is already included.

## Vercel
1. Import the project.
2. Framework preset: `Other`
3. Root directory: `bakery-shop`
4. `vercel.json` is already included.

## Local Preview
```bash
cd bakery-shop
python3 -m http.server 5502
```

Then open:
- http://127.0.0.1:5502/index.html
