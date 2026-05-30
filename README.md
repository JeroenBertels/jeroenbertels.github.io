# BRTLS Logic website

Simple static website for BRTLS Logic, intended for GitHub Pages.

## Structure

- `index.html` - home page with animated logic canvas
- `services.html` - consultancy services
- `projects.html` - selected project experience
- `contact.html` - contact form, currently using `mailto:contact@brtls.be` until a form backend is connected
- `assets/` - styles, JavaScript, logo assets, and the cropped header mark
- `CNAME` - GitHub Pages custom domain, set to `brtls.be`

## Local preview

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## GitHub Pages setup

1. Push this repository to GitHub.
2. In GitHub, open the repository.
3. Go to Settings -> Pages.
4. Under Build and deployment, set Source to "Deploy from a branch".
5. Select the main branch and `/ (root)`.
6. Under Custom domain, set:

```txt
brtls.be
```

7. Save and wait for the Pages build to finish.
8. Enable "Enforce HTTPS" once GitHub allows it after DNS propagation. This can take up to 24 hours.
9. Optional but recommended: verify `brtls.be` in your GitHub account Pages settings and keep the generated TXT record in DNS.

## DNS setup

In GoDaddy, open the DNS settings for `brtls.be`. Add or edit these records.

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

Do not add wildcard records such as `*.brtls.be`.

## Email setup

Buying the domain does not automatically create a working mailbox. To receive mail at `contact@brtls.be`, set up one of:

- GoDaddy Professional Email or Microsoft 365 from GoDaddy.
- Another mail provider, such as Google Workspace, Microsoft 365 direct, Proton, Fastmail, or Zoho.
- Email forwarding, if your GoDaddy account includes it.

After choosing an email provider, add the MX, SPF, DKIM, and DMARC DNS records that provider gives you. Do not remove the GitHub Pages `A` and `www` records while adding mail records.

## Contact form backend

GitHub Pages is static, so it cannot send email directly. The current form is only a temporary `mailto:` fallback.

Recommended simple option:

1. Create a Formspree form.
2. Set the form recipient to `contact@brtls.be`.
3. Copy the endpoint, which looks like `https://formspree.io/f/FORM_ID`.
4. Replace the `action` on `contact.html` with that endpoint.
5. Remove the custom mailto JavaScript handler from `assets/site.js`.
6. In Formspree, enable an autoresponse workflow so the submitter receives a confirmation email. The form already has an `email` field, which Formspree uses for reply-to and autoresponse routing.

Alternative robust option:

1. Create a small serverless endpoint, for example Cloudflare Worker, Netlify Function, Vercel Function, or AWS Lambda.
2. Use an email API such as Resend, Postmark, Mailgun, or SendGrid.
3. The endpoint sends one message to `contact@brtls.be` and one confirmation message to the submitter.
4. Add any sender authentication DNS records required by the email API.
5. Point the contact form to that endpoint.

## References

- GitHub Pages custom domain: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub Pages domain verification: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
- GoDaddy DNS records: https://www.godaddy.com/help/manage-dns-records-680
- Formspree autoresponse: https://help.formspree.io/articles/plugins/sending-a-confirmation-or-response-email/
