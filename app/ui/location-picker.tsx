"use client";

import { useState, useRef } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";
import { useUserLocation } from "@/app/hooks/use-user-location";
import { useAsyncData } from "@/app/hooks/use-async-data";
import {
  getStopsNearby,
  getStopsPopular,
  getAddressesNearby,
  getAddressesPopular,
  searchStops,
  searchAddresses,
} from "@/app/data/queries";
import { InferSelectModel } from "drizzle-orm";
import { stopsTable, addressesTable } from "@/app/db/schema";
import { PointGeo } from "../lib/locations";

type Stop = InferSelectModel<typeof stopsTable>;
type Address = InferSelectModel<typeof addressesTable>;

type LocationPickerProps = {
  name: string;
  label: string;
  placeholder: string;
  initialListVariation: "originList" | "destinationList";
};

type LocationOption = {
  kind: "stop" | "address" | "other";
  id: string;
  label: string;
  lat?: number;
  lng?: number;
};

function toLocationOptions(
  stops: Stop[] | null,
  addresses: Address[] | null,
): LocationOption[] {
  return [
    ...(stops ?? []).map((s) => ({
      kind: "stop" as const,
      id: `stop:${s.id}`,
      label: s.name,
    })),
    ...(addresses ?? []).map((a) => ({
      kind: "address" as const,
      id: `addr:${a.id}`,
      label: a.display_name,
    })),
  ];
}

const listConfig = {
  originList: {
    fetchStops: getStopsNearby,
    fetchAddresses: getAddressesNearby,
  },
  destinationList: {
    fetchStops: getStopsPopular,
    fetchAddresses: getAddressesPopular,
  },
} as const;

export default function LocationPicker({
  name,
  label,
  placeholder,
  initialListVariation,
}: LocationPickerProps) {
  // get current user location
  const { location: currentUserLocation } = useUserLocation();

  // build initial options to show when user didnt type anything yet
  const { fetchStops, fetchAddresses } = listConfig[initialListVariation];
  const { data: initialStops } = useAsyncData<PointGeo, Stop>(
    currentUserLocation,
    fetchStops,
  );
  const { data: initialAddresses } = useAsyncData<PointGeo, Address>(
    currentUserLocation,
    fetchAddresses,
  );
  const initialList = toLocationOptions(initialStops, initialAddresses);

  // store the user input and query the DB with it to get the list
  const [userInput, setUserInput] = useState("");
  const { data: queriedStops } = useAsyncData<string, Stop>(
    userInput || null,
    searchStops,
  );
  const { data: queriedAddresses } = useAsyncData<string, Address>(
    userInput || null,
    searchAddresses,
  );
  const resultList = toLocationOptions(queriedStops, queriedAddresses);
  if (userInput.trim()) {
    const userInputOption: LocationOption = {
      kind: "other" as const,
      id: `othr:${userInput.trim()}`,
      label: userInput.trim(),
    };
    resultList.push(userInputOption);
  }

  // choose which list to display based on presence of user input
  const allItems = userInput.trim() ? resultList : initialList;

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function debounceUserInput(value: string, delayMs: number = 300) {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setUserInput(value);
    }, delayMs)
  }

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Combobox
        name={name}
        autoHighlight={"always" as unknown as boolean}
        items={allItems}
        itemToStringLabel={(item: LocationOption) => item.label}
        itemToStringValue={(item: LocationOption) => item.id}
        onInputValueChange={(val) => debounceUserInput(val)}
      >
        <ComboboxInput
          id={name}
          placeholder={placeholder}
        />
        <ComboboxContent>
          <ComboboxList>
            {(list) => (
              <ComboboxItem
                key={list.id}
                value={list}
              >
                {list.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
