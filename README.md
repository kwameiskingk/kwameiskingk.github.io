# Kwame Mbugua — portfolio site v4 (Vexon Systems)

Static site: one `index.html`, one `style.css`, one small `script.js`, a few images in `img/`. No build step, no framework, no tracking. Light and dark mode follow the visitor's system setting, with a toggle in the top bar that remembers the choice. Monochrome palette (white, black, silver, grey) with one steel accent for focus rings. The only gradients are the brushed-metal VX monogram (hero and top bar) and the figure placeholders.

## Files

```
site/
  index.html    the whole page (hero, five case studies, stats row, stack, about, contact)
  style.css     all styling (CSS variables for light/dark, Schibsted Grotesk + IBM Plex Mono)
  script.js     theme toggle, fade-in on scroll, stats count-up, scroll-progress line, hero parallax, magnetic button (all optional: the page reads fine without JS)
  img/          screenshots (scrubbed; drop new ones here) and kwame.jpg, the About portrait (greyscale is applied in CSS)
  README.md     this file
```

## Before you publish

1. **GitHub link.** Replace `[GITHUB]` in the Contact section of `index.html` (it appears twice: once in the `href`, once as the visible text). Email and LinkedIn are already filled in.
2. **Get in touch button.** The button in the top bar is `mailto:kwamenova@gmail.com` for now (it carries a `data-note` saying so). Later, point it at a Kronos priority-email event instead.
3. **Hero line.** The `<h1>` is "I build systems that make businesses run smoother." The two alternatives sit in an HTML comment directly under it; swap the text if you prefer one of those.
4. **Logo.** The top-bar brand is the VX monogram from `../brand/mark-05-vx.svg`, inlined with its metal gradient reading CSS variables (`--m1`, `--m2`, `--m3`, `--mback`) so it works on both themes. The hero monogram is the same geometry as two CSS-masked layers (`.vx-back`, `.vx-front`) so the V carries the gradient and a 7-second specular sweep; the mask data URIs live in `style.css` under the hero section.
5. **Figure placeholders.** Three case studies (Kronos, CV-screening agent, client booking + ATS) contain a `<div class="ph">…</div>` inside the `.frame` of their `<figure>`; swap that div for `<img src="img/your-file.png" width="…" height="…" alt="…" loading="lazy">`. Images are cropped to 16:10 (top-left anchored) inside a browser frame, so landscape screenshots work best. Check every image for client names, emails or data before adding it.
6. Open `index.html` in a browser and read it top to bottom once, in both light and dark mode.

## Publish on GitHub Pages (user site)

A user site is served from a repo named exactly `<username>.github.io` and appears at `https://<username>.github.io/`.

1. On GitHub, create a new **public** repository named `<username>.github.io` (replace `<username>` with your GitHub username). Leave it empty: no README, no licence.
2. In a terminal, turn this folder into a git repo and commit it:

   ```sh
   cd /Users/kwame/Portfolio/site
   git init -b main
   git add .
   git commit -m "Portfolio v4"
   ```

3. Point it at GitHub and push:

   ```sh
   git remote add origin https://github.com/<username>/<username>.github.io.git
   git push -u origin main
   ```

4. On GitHub, open the repo → **Settings** → **Pages**. Under *Build and deployment*, set **Source** to *Deploy from a branch*, **Branch** to `main` and folder `/ (root)`, then **Save**.
5. Wait a minute or two, then open `https://<username>.github.io/`. Every later `git push` to `main` republishes the site automatically.

### Updating later

```sh
cd /Users/kwame/Portfolio/site
git add .
git commit -m "Update case studies"
git push
```

### Custom domain (optional)

Add a file named `CNAME` containing your domain (for example `vexonsystems.com`), push it, then set the domain's DNS: a `CNAME` record for `www` pointing to `<username>.github.io`, and `A` records for the apex pointing to GitHub Pages' four IPs (listed in GitHub's Pages docs). Then enable *Enforce HTTPS* in Settings → Pages.

## Checks

- `xmllint --html --noout index.html` only complains about HTML5 tags (`header`, `main`, `section`, `article`, `figure`); the macOS libxml is HTML4-era. Anything else it reports is a real error.
- Verified in headless Chrome at 1280px and 390px, light and dark: no horizontal scroll. Page height is about 7,800px on desktop and 10,100px on a phone (v3 was 4,970 and 7,600; the editorial case layouts are taller by design).
- Motion: sections fade in on scroll, the six stats count up when they come into view, a hairline progress bar grows under the top bar, the hero monogram drifts slightly on scroll and its specular sweep loops every 7 seconds, and the Get in touch button follows the pointer a little. All of it respects `prefers-reduced-motion` (final values, no movement, no sweep). Without JavaScript the page shows everything at once with the final numbers.
- Text contrast: the lightest grey text is 5.1:1 on white and 6.1:1 on the dark background (WCAG AA for small text is 4.5:1).
- Google Fonts are loaded from `fonts.googleapis.com` with system fallbacks; everything else is local.
