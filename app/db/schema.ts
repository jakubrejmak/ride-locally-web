// Mirror of the database schema, which Alembic owns (scraper/alembic). Don't edit
// by hand: after a migration, run `npx drizzle-kit pull` and replace this file
// with the generated drizzle/schema.ts.
import {
  boolean,
  date,
  geometry,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  time,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const routeTypeEnum = pgEnum("route_type", [
  "bus",
  "tram",
  "rail",
  "subway",
  "ferry",
  "cable_car",
  "gondola",
  "funicular",
]);

export const exceptionTypeEnum = pgEnum("exception_type", ["added", "removed"]);

export const carriersTable = pgTable("carriers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  homepage: varchar(),
  contact_phone: varchar({ length: 20 }),
  contact_email: varchar({ length: 255 }),
  timezone: varchar({ length: 64 }).notNull(),
  country: varchar({ length: 2 }).notNull(),
});

export const stopsTable = pgTable(
  "stops",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    coordinates: geometry("coordinates", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }),
  },
  (t) => [index("stops_spatial_idx").using("gist", t.coordinates)],
);

export const routesTable = pgTable("routes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  carrier_id: integer()
    .references(() => carriersTable.id, { onDelete: "cascade" })
    .notNull(),
  short_name: varchar({ length: 50 }).notNull(),
  long_name: varchar({ length: 255 }),
  description: varchar(),
  route_type: routeTypeEnum("route_type").notNull(),
  color: varchar({ length: 6 }),
  text_color: varchar({ length: 6 }),
  origin_stop: integer()
    .references(() => stopsTable.id, { onDelete: "restrict" })
    .notNull(),
  destination_stop: integer()
    .references(() => stopsTable.id, { onDelete: "restrict" })
    .notNull(),
});

export const calendarTable = pgTable("calendar", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  monday: boolean().notNull().default(false),
  tuesday: boolean().notNull().default(false),
  wednesday: boolean().notNull().default(false),
  thursday: boolean().notNull().default(false),
  friday: boolean().notNull().default(false),
  saturday: boolean().notNull().default(false),
  sunday: boolean().notNull().default(false),
  start_date: date(),
  end_date: date(),
});

export const calendarDatesTable = pgTable(
  "calendar_dates",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    calendar_id: integer()
      .references(() => calendarTable.id, { onDelete: "cascade" })
      .notNull(),
    date: date().notNull(),
    exception_type: exceptionTypeEnum("exception_type").notNull(),
  },
  (t) => [unique().on(t.calendar_id, t.date)],
);

export const tripsTable = pgTable("trips", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  route_id: integer()
    .references(() => routesTable.id, { onDelete: "cascade" })
    .notNull(),
  calendar_id: integer()
    .references(() => calendarTable.id, { onDelete: "restrict" })
    .notNull(),
  duration: integer(),
  distance: integer(),
});

export const fareAttributesTable = pgTable("fare_attributes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  route_id: integer()
    .references(() => routesTable.id, { onDelete: "cascade" })
    .notNull(),
  price: integer().notNull(),
  currency: varchar({ length: 3 }).notNull(),
});

export const tripStopsTable = pgTable(
  "trip_stops",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    trip_id: integer()
      .references(() => tripsTable.id, { onDelete: "cascade" })
      .notNull(),
    stop_id: integer()
      .references(() => stopsTable.id, { onDelete: "restrict" })
      .notNull(),
    stop_order: integer().notNull(),
    arrival_time: time().notNull(),
    departure_time: time().notNull(),
  },
  (t) => [unique().on(t.trip_id, t.stop_order)],
);

export const stopsMetricsTable = pgTable("stops_metrics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  stop_id: integer()
    .references(() => stopsTable.id, { onDelete: "cascade" })
    .notNull(),
  click_time: timestamp().notNull(),
});

export const addressProviderEnum = pgEnum("address_provider", [
  "osm",
  "google",
  "here",
  "mapbox",
]);

export const addressesTable = pgTable(
  "addresses",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    display_name: varchar().notNull(),
    street: varchar({ length: 255 }),
    house_number: varchar({ length: 20 }),
    city: varchar({ length: 100 }),
    postcode: varchar({ length: 20 }),
    country: varchar({ length: 2 }),
    coordinates: geometry("coordinates", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }),
  },
  (t) => [index("addresses_spatial_idx").using("gist", t.coordinates)],
);

export const addressesRawTable = pgTable(
  "addresses_raw",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    address_id: integer()
      .references(() => addressesTable.id, { onDelete: "cascade" })
      .notNull(),
    raw: jsonb("raw").notNull(),
    provider: addressProviderEnum("provider").notNull(),
    external_id: varchar({ length: 255 }),
  },
  (t) => [unique().on(t.provider, t.external_id)],
);

export const addressesMetricsTable = pgTable("addresses_metrics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  address_id: integer()
    .references(() => addressesTable.id, { onDelete: "cascade" })
    .notNull(),
  click_time: timestamp().notNull(),
});

export const userRoleEnum = pgEnum("user_role", [
  "sys_superuser",
  "sys_admin",
  "sys_moderator",
  "sub_default",
  "sub_premium",
]);

export const usersTable = pgTable("web_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar(),
  email: varchar(),
  password_hash: varchar().notNull(),
  role: userRoleEnum(),
  last_logged_in: timestamp(),
  premium_expires: timestamp(),
});
