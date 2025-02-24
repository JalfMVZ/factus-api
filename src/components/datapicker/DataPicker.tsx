import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormMessage } from "@/components/ui/form";
import { es } from "date-fns/locale";
import { useState } from "react";

interface DatePickerProps {
  value?: string;
  onChange: (date: string | undefined) => void;
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  className,
  label,
  error = false,
  errorMessage,
  required = false,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date?.toISOString().split("T")[0]);
    setOpen(false);
  };

  let parsedDate: Date | undefined;
  try {
    parsedDate = value ? new Date(value) : undefined;
  } catch (error) {
    console.error("Fecha inválida:", value);
    parsedDate = undefined;
  }

  return (
    <div className="space-y-2">
      {label && (
        <label
          className={cn(
            "text-sm font-medium text-gray-700",
            error && "text-red-500"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !parsedDate && "text-muted-foreground",
              error && "border-red-500 hover:border-red-600",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {parsedDate ? (
              format(parsedDate, "dd/MM/yyyy", { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0"
          align="start"
          onInteractOutside={(e) => e.preventDefault()} // Evitar cierre al seleccionar fecha
        >
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={handleSelect}
            initialFocus
            locale={es}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            classNames={{
              day_selected: "bg-invoice-500 hover:bg-invoice-600",
              day_today: "border border-invoice-500",
            }}
          />
        </PopoverContent>
      </Popover>

      {errorMessage && (
        <FormMessage className="text-red-500 text-sm">
          {errorMessage}
        </FormMessage>
      )}
    </div>
  );
}
