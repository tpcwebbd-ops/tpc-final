# Deployment and operations

## Required production configuration

Set the values in Vercel Project Settings, never in source control:

- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_TRUSTED_ORIGINS`
- `MONGODB_URI`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD`
- SMTP variables, OAuth credentials, UploadThing token, and only intentionally public variables prefixed `NEXT_PUBLIC_`

Use exact HTTPS origins for trusted origins and Google redirect URI: `https://your-domain/api/auth/v1/callback/google`.

## Vercel + Atlas operating baseline

- Place Vercel functions close to MongoDB Atlas; enable Fluid compute.
- Enable Atlas backups, autoscaling, IP/network restrictions, and Performance Advisor.
- Use shared Redis for rate limits and authorization cache.
- Monitor error rate, p95 latency, function usage, Atlas CPU/memory/connections, slow queries, Redis errors, and upload failures.

## Capacity guidance

There is no fixed user count. This architecture can be planned for roughly 1M registered accounts with appropriate Atlas/Redis sizing, indexes, monitoring, and load tests. Growing toward 10M requires measured traffic, database capacity decisions, retention, and possibly sharding; it is not a code-only guarantee.

## Release checklist

1. `npx tsc --noEmit`
2. Targeted `npx eslint <changed-files>`
3. `npm run build`
4. Test login, verified email, blocked account, each permission level, unauthorized API response, rate limiting, upload ownership, and public cache refresh.
5. Deploy to Preview first; use production secrets only for Production.
