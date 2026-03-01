"use client";

import { useState } from "react";
import { useLocale } from "@/app/locale-context";
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

interface TimePickerMode {
  value: string;
  label: string;
  shortLabel: string;
}

interface TimePickerProps {
  label: string;
  placeholder: string;
  modes: TimePickerMode[];
  name: string;
}

export default function TimePicker({
  label,
  placeholder,
  modes,
  name,
}: TimePickerProps) {
  const locale = useLocale();
  const [mode, setMode] = useState(modes[0].value);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString(locale.code, { hour: "2-digit", minute: "2-digit", hour12: false });
  });

  const activeMode = modes.find((m) => m.value === mode) ?? modes[0];
  const buttonLabel = time
    ? `${time} · ${activeMode.shortLabel}`
    : placeholder;

  return (
    <Field>
      <FieldLabel htmlFor={`${name}-picker`}>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={`${name}-picker`}
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
            placeholder={placeholder}
            className="text-center bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          {modes.length > 1 && (
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(v) => v && setMode(v)}
              variant="outline"
            >
              {modes.map((m) => (
                <ToggleGroupItem key={m.value} value={m.value}>
                  {m.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        </PopoverContent>
      </Popover>
      <input type="hidden" name={name} value={time} />
      <input type="hidden" name={`${name}Mode`} value={mode} />
    </Field>
  );
}
