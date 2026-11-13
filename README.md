# Docora — GitHub Pages Website

A minimal, responsive, multilingual (TR / EN / DE) landing page and policy site for Docora. Includes light/dark modes, accessible navigation, support FAQ, and privacy/terms pages with official Docora branding.

No build step, framework, cookies, analytics, or external assets are required.

## Files

```
index.html              Marketing / homepage
privacy.html            Privacy Policy
terms.html              Terms of Service
support.html            Support and FAQ
assets/logo.png         Official Docora logo (512x512)
assets/favicon.svg      Vector favicon with Docora logo
assets/favicon-32x32.png Standard 32px favicon
assets/favicon-16x16.png Standard 16px favicon
assets/apple-touch-icon.png iOS/macOS web clip icon (180x180)
assets/style.css        Layout, Docora brand theme (#c80d25), responsive design
assets/content.js       All three language texts (TR, EN, DE) and contact config
assets/main.js          Language switching, theme toggle, navigation, app screen rendering
.nojekyll               GitHub Pages compatibility
.gitignore              Git ignore file
README.md               English guide
KURULUM_TR.md           Turkish setup, test and deployment guide
```

## Local Preview & Testing

To test the website locally on your computer:

```bash
# Option 1: Open directly in default browser
open index.html

# Option 2: Run a local HTTP server
python3 -m http.server 8000
open http://localhost:8000
```

## Publish to GitHub Pages

1. Initialize repository and commit (already prepared):
   ```bash
   git add .
   git commit -m "feat: integrate official Docora logo and branding"
   ```
2. Create a public repository named `docora-support` on [GitHub](https://github.com/new).
3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/docora-support.git
   git branch -M main
   git push -u origin main
   ```
4. In GitHub repository: **Settings → Pages → Branch: main / (root) → Save**.

## Store Links

| Platform | Field | Page |
| --- | --- | --- |
| App Store Connect | Marketing URL (optional) | `index.html` |
| App Store Connect | Support URL (required) | `support.html` |
| App Store Connect | Privacy Policy URL (required) | `privacy.html` |
| Google Play Console | Privacy policy (required) | `privacy.html` |
| Google Play Console | Terms of Service | `terms.html` |
