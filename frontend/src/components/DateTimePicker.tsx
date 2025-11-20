import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    if (value) {
      // Format date as YYYY-MM-DD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      setDateStr(`${year}-${month}-${day}`);

      // Format time as HH:MM
      const hours = String(value.getHours()).padStart(2, "0");
      const minutes = String(value.getMinutes()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}`);
    }
  }, [value]);

  const handleDateChange = (newDateStr: string) => {
    setDateStr(newDateStr);
    if (newDateStr && timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const newDate = new Date(newDateStr);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    }
  };

  const handleTimeChange = (newTimeStr: string) => {
    setTimeStr(newTimeStr);
    if (dateStr && newTimeStr) {
      const [hours, minutes] = newTimeStr.split(":").map(Number);
      const newDate = new Date(dateStr);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    }
  };

  const getMinDateStr = () => {
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, "0");
    const day = String(minDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="capsule-date">Date</Label>
        <Input
          id="capsule-date"
          type="date"
          value={dateStr}
          onChange={(e) => handleDateChange(e.target.value)}
          min={getMinDateStr()}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="capsule-time">Time</Label>
        <Input
          id="capsule-time"
          type="time"
          value={timeStr}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
