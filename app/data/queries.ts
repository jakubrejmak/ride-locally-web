"use server";

import { sql, InferSelectModel } from "drizzle-orm";
import { db } from "@/app/db/index";
import { stopsTable, addressesTable } from "@/app/db/schema";
import type { PointGeo } from "@/app/lib/locations";

type Stop = InferSelectModel<typeof stopsTable>;

export async function getStopsNearby(
  location: PointGeo,
  withinMeters: number = 50_000,
  limit: number = 10,
): Promise<Stop[]> {
  const point = sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography`;

  const q = sql`
    SELECT * FROM stops
    WHERE ST_DWithin(location, ${point}, ${withinMeters})
    ORDER BY location <-> ${point}
    LIMIT ${limit}`;

  const result = await db.execute<Stop>(q);

  return result.rows;
}

export async function getStopsPopular(
  location: PointGeo,
  withinMeters: number = 50_000,
  limit: number = 10,
): Promise<Stop[]> {
  const point = sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography`;

  const q = sql`
    SELECT s.id, s.name, s.location
    FROM stops s
    LEFT JOIN stops_metrics sm ON sm.stop_id = s.id
    WHERE ST_DWithin(s.location, ${point}, ${withinMeters})
    GROUP BY s.id
    ORDER BY COUNT(sm.id) DESC, s.location <-> ${point}
    LIMIT ${limit}`;

  const result = await db.execute<Stop>(q);

  return result.rows;
}

type Address = InferSelectModel<typeof addressesTable>;

export async function getAddressesNearby(
  location: PointGeo,
  withinMeters: number = 50_000,
  limit: number = 10,
): Promise<Address[]> {
  const point = sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography`;

  const q = sql`
    SELECT id, display_name, street, house_number, city, postcode, country, location
    FROM addresses
    WHERE ST_DWithin(location, ${point}, ${withinMeters})
    ORDER BY location <-> ${point}
    LIMIT ${limit}`;

  const result = await db.execute<Address>(q);
  return result.rows;
}

export async function getAddressesPopular(
  location: PointGeo,
  withinMeters: number = 50_000,
  limit: number = 10,
): Promise<Address[]> {
  const point = sql`ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography`;

  const q = sql`
    SELECT a.id, a.display_name, a.street, a.house_number, a.city, a.postcode, a.country, a.location
    FROM addresses a
    LEFT JOIN addresses_metrics am ON am.address_id = a.id
    WHERE ST_DWithin(a.location, ${point}, ${withinMeters})
    GROUP BY a.id
    ORDER BY COUNT(am.id) DESC, a.location <-> ${point}
    LIMIT ${limit}`;

  const result = await db.execute<Address>(q);
  return result.rows;
}

export async function searchStops(
  query: string,
  limit: number = 10,
): Promise<Stop[]> {
  const q = sql`
    SELECT s.id, s.name, s.location
    FROM stops
    LIMIT ${limit}`;

  const result = await db.execute<Stop>(q);

  return result.rows;
}

export async function searchAddresses(
  query: string,
  limit: number = 10,
): Promise<Address[]> {
  const q = sql`
    SELECT id, display_name, street, house_number, city, postcode, country, location
    FROM addresses
    LIMIT ${limit}`;

  const result = await db.execute<Address>(q);

  return result.rows;
}
