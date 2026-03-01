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
} from "drizzle-orm/pg-core";
import { time } from "drizzle-orm/pg-core";

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
    return "geography(Point,4326)";
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

export const routesTable = pgTable("routes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  carrier_id: integer()
    .references(() => carriersTable.id)
    .notNull(),
  short_name: varchar({ length: 50 }).notNull(),
  long_name: varchar({ length: 255 }),
  description: varchar(),
  route_type: routeTypeEnum("route_type").notNull(),
  color: varchar({ length: 6 }),
  text_color: varchar({ length: 6 }),
  origin_stop: integer()
    .references(() => stopsTable.id)
    .notNull(),
  destination_stop: integer()
    .references(() => stopsTable.id)
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
    .references(() => calendarTable.id)
    .notNull(),
  date: date().notNull(),
  exception_type: exceptionTypeEnum("exception_type").notNull(),
});

export const tripsTable = pgTable("trips", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  route_id: integer()
    .references(() => routesTable.id)
    .notNull(),
  calendar_id: integer()
    .references(() => calendarTable.id)
    .notNull(),
  duration: integer(),
  distance: integer(),
});

export const fareAttributesTable = pgTable("fare_attributes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  route_id: integer()
    .references(() => routesTable.id)
    .notNull(),
  price: integer().notNull(),
  currency: varchar({ length: 3 }).notNull(),
});

export const stopsTable = pgTable("stops", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  coordinates: geographyPoint("coordinates").notNull(),
});

export const tripStopsTable = pgTable("trip_stops", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  trip_id: integer()
    .references(() => tripsTable.id)
    .notNull(),
  stop_id: integer()
    .references(() => stopsTable.id)
    .notNull(),
  stop_order: integer().notNull(),
  arrival_time: time().notNull(),
  departure_time: time().notNull(),
});

export const stopsMetrics = pgTable("stops_metrics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  stop_id: integer()
    .references(() => stopsTable.id)
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
    .references(() => addressesTable.id)
    .notNull(),
  raw: jsonb("raw").notNull(),
  provider: addressProviderEnum("provider").notNull(),
  external_id: varchar({ length: 255 }),
});

export const addressesMetrics = pgTable("addresses_metrics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  address_id: integer()
    .references(() => addressesTable.id)
    .notNull(),
  click_time: timestamp().notNull(),
});
