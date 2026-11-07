# Exeter Tech Solutions redesign preview

Separate staging website. The existing public website and bookings portal stay
on their own Workers. This repository currently contains a placeholder to verify
deployment; the replacement website design has not been built yet.

## Cloudflare Workers Git setup

| Setting | Value |
| --- | --- |
| Repository | exetechsolutions12/exeter-tech-solutions-redesign |
| Worker name | exeter-tech-solutions-redesign |
| Production branch | main |
| Root directory | / |
| Build command | Leave blank |
| Deploy command | npx --yes wrangler@4.158.0 deploy |
| Preview builds | Disabled; this entire Worker is the test site |
| Custom domain | Leave unconfigured during development |
| Runtime variables/secrets | None required |

Use the new Worker's generated workers.dev URL to view changes. Deploy only this
repository's config: its Worker name is deliberately different from both existing
Workers and it defines no custom-domain route. Connect the public domain only as
an explicit later launch step. The default workers.dev URL is public; GitHub's
private repository setting does not restrict visitors. Cloudflare Access can be
configured separately if the preview needs to be private. Robots directives ask
search engines not to index the preview; they are not access control.

Static files are under public, with no npm dependencies or build step.
For local checks: `npx --yes wrangler@4.158.0 dev`.
For a deployment check: `npx --yes wrangler@4.158.0 deploy --dry-run`.
