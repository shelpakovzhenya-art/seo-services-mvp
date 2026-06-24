# Deployment Boundaries

This project is deployed as the independent `seo site` service.

Production path:

- `/opt/seo site`

Allowed resources for this project:

- Docker Compose project: `seo_site`
- Containers: `seo-site-app`, `seo-site-db`
- Volumes: `seo_site_pgdata`
- Database: `seo_services`
- Domain: `shelpakov.online` without `www`

Hard boundaries:

- Do not store this project inside `/opt/signal`.
- Do not reuse Signal database, media volume, environment files, app container, or source tree.
- Do not change Signal application code for SEO site work.
- The only shared component may be the front nginx reverse proxy on ports `80` and `443`, and only for a clearly marked `SEO SITE ROUTING` server block for `shelpakov.online`.
- Any future work on Signal/Sprintbox and SEO site must use separate branches, folders, containers, databases, volumes, and deployment commands.

