import {
  integer,
  pgEnum,
  pgTable,
  varchar,
  customType,
  timestamp,
  boolean,
  date,
  jsonb,
  time,
  unique,
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

export const geographyPoint = customType<{ data: unknown }>({
  dataType() {
    return 'geography(Point,4326)';
  },
});

export const carriersTable = pgTable("carriers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  homepage: varchar(),
  contact_phone: varchar({ length: 20 }),
  contact_email: varchar({ length: 255 }),
  timezone: varchar({ length: 64 }).notNull(),
  country: varchar({ length: 2 }).notNull(),
});

export const stopsTable = pgTable("stops", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  coordinates: geographyPoint("coordinates").notNull(),
});

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
  start_date: date().notNull(),
  end_date: date().notNull(),
});

export const calendarDatesTable = pgTable("calendar_dates", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  calendar_id: integer()
    .references(() => calendarTable.id, { onDelete: "cascade" })
    .notNull(),
  date: date().notNull(),
  exception_type: exceptionTypeEnum("exception_type").notNull(),
}, (t) => [
  unique().on(t.calendar_id, t.date),
]);

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

export const tripStopsTable = pgTable("trip_stops", {
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
}, (t) => [
  unique().on(t.trip_id, t.stop_order),
]);

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

export const addressesTable = pgTable("addresses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  display_name: varchar().notNull(),
  street: varchar({ length: 255 }),
  house_number: varchar({ length: 20 }),
  city: varchar({ length: 100 }),
  postcode: varchar({ length: 20 }),
  country: varchar({ length: 2 }),
  coordinates: geographyPoint("coordinates").notNull(),
});

export const addressesRawTable = pgTable("addresses_raw", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  address_id: integer()
    .references(() => addressesTable.id, { onDelete: "cascade" })
    .notNull(),
  raw: jsonb("raw").notNull(),
  provider: addressProviderEnum("provider").notNull(),
  external_id: varchar({ length: 255 }),
}, (t) => [
  unique().on(t.provider, t.external_id),
]);

export const addressesMetricsTable = pgTable("addresses_metrics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  address_id: integer()
    .references(() => addressesTable.id, { onDelete: "cascade" })
    .notNull(),
  click_time: timestamp().notNull(),
});

// scraper tables
export const scrapeStatusEnum = pgEnum("scrape_status", ["pending", "running", "success", "failed"]);

export const ttScrTargetsTable = pgTable("tt_scr_targets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  url: varchar().notNull(),
  config: jsonb().notNull(),
  schedule_cron: varchar({ length: 100 }),
  is_active: boolean().notNull().default(true),
  carrier_id: integer().notNull().references(() => carriersTable.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
});

export const ttScrRunsTable = pgTable("tt_scr_runs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  target_id: integer().notNull().references(() => ttScrTargetsTable.id, { onDelete: "cascade" }),
  status: scrapeStatusEnum("status").notNull().default("pending"),
  o_filepath: varchar(),
  error_message: varchar(),
  started_at: timestamp(),
  finished_at: timestamp(),
  created_at: timestamp().notNull().defaultNow(),
});

export const ttScrProcessedTable = pgTable("tt_scr_processed", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  run_id: integer().notNull().references(() => ttScrRunsTable.id, { onDelete: "cascade" }),
  target_id: integer().notNull().references(() => ttScrTargetsTable.id, { onDelete: "cascade" }),
  o_filepath: varchar().notNull(),
  version: integer().notNull().default(1),
  created_at: timestamp().notNull().defaultNow(),
});
