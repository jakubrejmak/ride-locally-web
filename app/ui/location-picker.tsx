"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";
import { LocationOption } from "@/app/lib/locations";
import { useUserLocation, useLocations } from "@/app/hooks/use-locations";
import {
  getStopsCloseby,
  getStopsPopular,
  getLocationsCloseby,
  getLocationsPopular,
} from "@/app/data/queries";
import { InferSelectModel } from "drizzle-orm";
import { stopsTable, addressesTable } from "@/app/db/schema";

type Stop = InferSelectModel<typeof stopsTable>;
type Address = InferSelectModel<typeof addressesTable>;

type LocationGroup = {
  label: string;
  items: LocationOption[];
};

type Variant = "origin" | "destination";

const variantConfig: Record<
  Variant,
  {
    label: string;
    placeholder: string;
    stopsFn: typeof getStopsCloseby;
    stopsLabel: string;
    addressesFn: typeof getLocationsCloseby;
    addressesLabel: string;
  }
> = {
  origin: {
    label: "Origin",
    placeholder: "Pick origin",
    stopsFn: getStopsCloseby,
    stopsLabel: "Nearby stops",
    addressesFn: getLocationsCloseby,
    addressesLabel: "Nearby addresses",
  },
  destination: {
    label: "Destination",
    placeholder: "Pick destination",
    stopsFn: getStopsPopular,
    stopsLabel: "Popular stops nearby",
    addressesFn: getLocationsPopular,
    addressesLabel: "Popular addresses nearby",
  },
};

function toStopGroup(label: string, data: Stop[] | null): LocationGroup {
  return {
    label,
    items: (data ?? []).map((s) => ({
      kind: "stop" as const,
      id: `stop:${s.id}`,
      label: s.name,
    })),
  };
}

function toAddressGroup(label: string, data: Address[] | null): LocationGroup {
  return {
    label,
    items: (data ?? []).map((a) => ({
      kind: "address" as const,
      id: `address:${a.id}`,
      label: a.display_name,
    })),
  };
}

export default function LocationPicker({ variant }: { variant: Variant }) {
  const [value, setValue] = useState<LocationOption | null>(null);
  const config = variantConfig[variant];

  const { location: userLoc } = useUserLocation();
  const { data: stops } = useLocations(userLoc, config.stopsFn);
  const { data: addresses } = useLocations(userLoc, config.addressesFn);

  const groups = [
    toStopGroup(config.stopsLabel, stops),
    toAddressGroup(config.addressesLabel, addresses),
  ];
  const allItems = groups.flatMap((g) => g.items);

  return (
    <Field>
      <FieldLabel htmlFor={variant}>{config.label}</FieldLabel>
      <Combobox
        value={value}
        onValueChange={setValue}
        items={allItems}
        itemToStringValue={(item: LocationOption) => item.label}
      >
        <input
          type='hidden'
          name={variant}
          value={value?.id ?? ""}
        />
        <ComboboxInput
          id={variant}
          placeholder={config.placeholder}
        />
        <ComboboxContent>
          <ComboboxList>
            {groups.map((group) => (
              <ComboboxGroup key={group.label}>
                <ComboboxLabel>{group.label}</ComboboxLabel>
                {group.items.map((item) => (
                  <ComboboxItem
                    key={item.id}
                    value={item}
                  >
                    {item.label}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
