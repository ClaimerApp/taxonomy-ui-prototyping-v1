# Taxonomy UI — MVP Prototype

Proactive Tax Intelligence platform prototype. Interactive UI demonstrating the core insight timeline, evidence drill-down, client portfolio, and alert delivery experience.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

### First time setup

1. Create the repo on GitHub under the `taxonomy` org:

```bash
gh repo create taxonomy/taxonomy-ui --public --source=. --remote=origin
```

Or manually create `taxonomy/taxonomy-ui` on GitHub and add the remote:

```bash
git remote add origin git@github.com:taxonomy/taxonomy-ui.git
```

2. Push the source code:

```bash
git push -u origin main
```

3. Deploy to GitHub Pages:

```bash
npm run deploy
```

This builds the project and pushes the `dist` folder to the `gh-pages` branch.

4. In the GitHub repo settings, go to **Pages** and ensure the source is set to the `gh-pages` branch.

The site will be live at: `https://taxonomy.github.io/taxonomy-ui/`

### Subsequent deploys

```bash
npm run deploy
```

## Quick one-liner (after repo is created)

```bash
npm install && git add -A && git commit -m "Initial commit" && git push -u origin main && npm run deploy
```
