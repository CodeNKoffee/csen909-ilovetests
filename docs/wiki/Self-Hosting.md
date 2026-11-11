# Self hosting

## Run locally
Node.js 20 or newer:

```bash
git clone https://github.com/CodeNKoffee/csen909-ilovetests.git
cd csen909-ilovetests
npm install
npm run dev        # http://localhost:3000
```

## Build the static site
```bash
npm run build      # writes ./out
npm start          # serves ./out on http://localhost:3000
```

## Deploy on Vercel
Import the repository at vercel.com/new and keep the defaults. Security headers come from `vercel.json`.

## Deploy on GitHub Pages
Build with `NEXT_PUBLIC_BASE_PATH=/csen909-ilovetests npm run build` and publish `out`.

## Update
`git pull`, then build again.
