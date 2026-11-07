# Markevance website

Static Astro website for [markevance.com](https://markevance.com), including the
compact homepage, animated service explanations, and current Markevance logos.

This repository contains website source, public assets, build configuration,
and validation scripts/tests. It starts from a clean snapshot, without the
previous repository history, internal planning documents, reports, or raw logo kits.

## Local development

Use Node.js 22.12 or newer and npm with the committed lockfile.

```sh
npm ci
npm run dev
```

The development server uses http://localhost:4321. No private credentials are
needed. `.env.example` documents the optional public Formspree endpoint;
`PUBLIC_` values are visible to website visitors. Never place secrets in them.

## Validation and production build

```sh
npm run check
npm test
npm run format:check
npm run build
npm run validate:build
npm run preview
```

The static output is generated in `dist/`. Dependencies and generated output are
excluded from Git. The preview command serves the generated site locally.

## Hosting

For a separately authorized deployment to cPanel/Apache, upload only the contents
of `dist/` to the verified website root, including the hidden `.htaccess` file.
Review compatibility with existing Apache rules and verify HTTPS, redirects,
security headers, and the 404 response on the host. Local preview does not execute
Apache configuration.

Creating or pushing this repository does not deploy the production website.
Formspree delivery still requires verification on an allowed domain; localhost
is not an approved submission origin. Newsletter and analytics integrations are
inactive. Hosting and legal review remain separate release requirements.

Local fonts and icon licensing are retained under `public/fonts/` and
`public/licenses/`.

## cPanel Git deployment

The cPanel checkout is `/home/pmnmmwbp/repositories/markevance-website` on `cpanel`.
Use **Update from Remote**, then **Deploy HEAD Commit** in Git Version Control.
The shared host's process limit prevents a reliable Node.js build. Build and run
all validation commands locally from `main`, then publish that source revision
and the generated `dist/` to the `cpanel` release branch. Each release includes
`cpanel-release.sha256` listing every build file and `cpanel-source-revision.txt`
identifying the source commit.

The deployment task verifies the release hashes, backs up the current domain
files under `~/markevance-deployments/`, and publishes the static build to the
verified `markevance.com` document root. Existing Apache rules and
domain-verification files are preserved. GitHub pushes require this manual
pull/deploy step after publishing the release branch.
