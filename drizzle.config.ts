import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Only used for `drizzle-kit pull`. Alembic (scraper/alembic) owns the schema,
// so never run generate/migrate/push against this database.
export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema.ts',
  dialect: 'postgresql',
  extensionsFilters: ['postgis'],
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
});
