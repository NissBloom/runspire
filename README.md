# Runspire - Run Coaching Website

## Database Setup

### Production Initialization

For a one-time production database ensure:

\`\`\`bash
curl -X POST https://<domain>/api/admin/init -H "x-admin-token: $ADMIN_INIT_TOKEN"
\`\`\`

### Environment Variables

- `ADMIN_INIT_TOKEN`: Secret token for database initialization
- `ALLOW_DB_RESET`: Set to `true` only in non-production if you want drop-and-recreate locally
- `DATABASE_URL`: Pooled connection URL for app runtime
- `DATABASE_URL_UNPOOLED`: Unpooled connection URL for migrations

### Development

Only set `ALLOW_DB_RESET=true` in non-production environments if you want to allow database resets.

### Health Check

The app includes a health endpoint at `/api/health` that runs every 15 minutes during business hours to keep the database connection warm.
