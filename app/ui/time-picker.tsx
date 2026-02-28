"use client";

import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronDownIcon } from "lucide-react";

type TimeMode = "departure" | "arrival";

export default function TimePicker() {
  const [mode, setMode] = useState<TimeMode>("departure");
  const [time, setTime] = useState("10:30");

  const buttonLabel = `${time} · ${mode === "departure" ? "Dep" : "Arr"}`;

  return (
    <Field>
      <FieldLabel htmlFor="time-picker">Time</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="time-picker"
            variant="outline"
            className="w-44 justify-between font-normal"
          >
            {buttonLabel}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col gap-3" align="start">
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="text-center bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as TimeMode)}
            variant="outline"
          >
            <ToggleGroupItem value="departure">Departure</ToggleGroupItem>
            <ToggleGroupItem value="arrival">Arrival</ToggleGroupItem>
          </ToggleGroup>
        </PopoverContent>
      </Popover>
      <input type="hidden" name="time" value={time} />
      <input type="hidden" name="timeMode" value={mode} />
    </Field>
  );
}
