"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
}

export default function DateTimePicker({
  value,
  onChange,
  minDate = new Date(),
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value || undefined);
  const [timeStr, setTimeStr] = React.useState("");

  React.useEffect(() => {
    if (value) {
      setDate(value);
      const hours = String(value.getHours()).padStart(2, "0");
      const minutes = String(value.getMinutes()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}`);
    }
  }, [value]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      if (timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        newDate.setHours(hours, minutes, 0, 0);
      }
      onChange(newDate);
    }
  };

  const handleTimeChange = (newTimeStr: string) => {
    setTimeStr(newTimeStr);
    if (date && newTimeStr) {
      const [hours, minutes] = newTimeStr.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 flex-1">
        <FieldLabel htmlFor="date-picker" className="px-1 text-white">
          Date
        </FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between font-normal bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <CalendarIcon className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0 bg-zinc-900 border-zinc-800" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                handleDateChange(selectedDate);
                setOpen(false);
              }}
              disabled={(date) => date < minDate}
              className="bg-zinc-900 text-white"
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <FieldLabel htmlFor="time-picker" className="px-1 text-white">
          Time
        </FieldLabel>
        <Input
          type="time"
          id="time-picker"
          value={timeStr}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
