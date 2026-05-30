# BRTLS Logic website

Simple static website for BRTLS Logic, intended for GitHub Pages.

## Structure

- `index.html` - home page with animated logic canvas
- `services.html` - consultancy services
- `projects.html` - selected project experience
- `contact.html` - static contact form using `mailto:info@brtls.be`
- `assets/` - styles, JavaScript, logo assets, and the cropped header mark
- `CNAME` - GitHub Pages custom domain, set to `brtls.be`

## Local preview

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## GitHub Pages setup

In the repository settings, configure Pages to publish from the main branch root and set the custom domain to:

```txt
brtls.be
```

Enable HTTPS once GitHub allows it after DNS propagation.

## DNS setup

For the apex domain `brtls.be`, add GitHub Pages `A` records:

```txt
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

Optionally add IPv6 `AAAA` records:

```txt
@  AAAA  2606:50c0:8000::153
@  AAAA  2606:50c0:8001::153
@  AAAA  2606:50c0:8002::153
@  AAAA  2606:50c0:8003::153
```

For `www.brtls.be`, add:

```txt
www  CNAME  jeroenbertels.github.io
```

With `brtls.be` as the custom domain, GitHub Pages should redirect `www.brtls.be` to `brtls.be`. The site JavaScript also redirects `www.brtls.be` and `jeroenbertels.github.io` to `https://brtls.be` as a client-side fallback.

Reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
