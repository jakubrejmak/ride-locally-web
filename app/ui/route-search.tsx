"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox";

import { useState } from "react";
import { LocationOption } from "@/app/lib/locations";
import { searchTrips } from "@/app/actions/actions";
import { useUserLocation, useLocations } from "@/app/hooks/use-locations";
import {
  getStopsCloseby,
  getStopsPopular,
  getLocationsCloseby,
  getLocationsPopular,
} from "@/app/data/queries";

export default function TripSearch() {
  const [origin, setOrigin] = useState<LocationOption | null>(null);
  const [destination, setDestination] = useState<LocationOption | null>(null);

  const { location: userLoc } = useUserLocation();

  const { data: stopsCloseby } = useLocations(userLoc, getStopsCloseby);
  const { data: stopsPopular } = useLocations(userLoc, getStopsPopular);
  const { data: locationsCloseby } = useLocations(userLoc, getLocationsCloseby);
  const { data: locationsPopular } = useLocations(userLoc, getLocationsPopular);

  const originItems: LocationOption[] = [
    ...(stopsCloseby ?? []).map((s) => ({
      kind: "stop" as const,
      id: `stop:${s.id}`,
      label: s.name,
    })),
    ...(locationsCloseby ?? []).map((a) => ({
      kind: "address" as const,
      id: `address:${a.id}`,
      label: a.display_name,
    })),
  ];

  const destinationItems: LocationOption[] = [
    ...(stopsPopular ?? []).map((s) => ({
      kind: "stop" as const,
      id: `stop:${s.id}`,
      label: s.name,
    })),
    ...(locationsPopular ?? []).map((a) => ({
      kind: "address" as const,
      id: `address:${a.id}`,
      label: a.display_name,
    })),
  ];

  return (
    <form action={searchTrips}>
      <Combobox
        value={origin}
        onValueChange={setOrigin}
        items={originItems}
        itemToStringValue={(item: LocationOption) => item.label}
      >
        <ComboboxInput placeholder="Select origin" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxGroup>
              <ComboboxLabel>Stops</ComboboxLabel>
              {(stopsCloseby ?? []).map((s) => (
                <ComboboxItem
                  key={`stop:${s.id}`}
                  value={{ kind: "stop", id: `stop:${s.id}`, label: s.name }}
                >
                  {s.name}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
            <ComboboxGroup>
              <ComboboxLabel>Addresses</ComboboxLabel>
              {(locationsCloseby ?? []).map((a) => (
                <ComboboxItem
                  key={`address:${a.id}`}
                  value={{ kind: "address", id: `address:${a.id}`, label: a.display_name }}
                >
                  {a.display_name}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Combobox
        value={destination}
        onValueChange={setDestination}
        items={destinationItems}
        itemToStringValue={(item: LocationOption) => item.label}
      >
        <ComboboxInput placeholder="Select destination" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxGroup>
              <ComboboxLabel>Stops</ComboboxLabel>
              {(stopsPopular ?? []).map((s) => (
                <ComboboxItem
                  key={`stop:${s.id}`}
                  value={{ kind: "stop", id: `stop:${s.id}`, label: s.name }}
                >
                  {s.name}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
            <ComboboxGroup>
              <ComboboxLabel>Addresses</ComboboxLabel>
              {(locationsPopular ?? []).map((a) => (
                <ComboboxItem
                  key={`address:${a.id}`}
                  value={{ kind: "address", id: `address:${a.id}`, label: a.display_name }}
                >
                  {a.display_name}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </form>
  );
}
