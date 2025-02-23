import { Controller } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/datapicker/DataPicker";
import { useEffect, useState } from "react";
import { numneringRanges } from "@/services/numbering-ranges";
import {
  InvoiceBasicFormProps,
  NumberingRange,
} from "../interfaces/inoiceForm";
import { useAuth } from "@/hooks/useAuth";

export function InvoiceBasicForm({ control }: InvoiceBasicFormProps) {
  const [ranges, setRanges] = useState<NumberingRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRanges = async () => {
      try {
        if (!token) throw new Error("No authentication token found");

        const data = await numneringRanges(token);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected an array");
        }

        setRanges(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch ranges");
      } finally {
        setLoading(false);
      }
    };

    fetchRanges();
  }, [token]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <FormField
        control={control}
        name="numbering_range_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700 font-medium">
              Numbering Range
            </FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
              disabled={loading || !!error}
            >
              <FormControl>
                <SelectTrigger
                  className={`w-full border-2 rounded-lg px-4 py-2 text-invoice-700 
                      focus:ring-2 focus:ring-invoice-500 transition-all ${
                        error ? "border-red-500" : "border-invoice-300"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading ranges..."
                        : error
                        ? "Failed to load ranges"
                        : "Select numbering range"
                    }
                    className="text-invoice-700"
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full border border-invoice-300 rounded-lg shadow-lg">
                {ranges.map((range) => (
                  <SelectItem
                    key={range.id}
                    value={range.id.toString()}
                    className="px-4 py-2 hover:bg-invoice-100 text-invoice-700 cursor-pointer transition-all"
                  >
                    {range.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <FormMessage className="text-red-500">{error}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reference_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Reference Code</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter reference code"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="observation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Observation</FormLabel>
            <FormControl>
              <Input
                placeholder="Add observation"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="payment_form"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Payment Form</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="border-invoice-200 focus:border-invoice-500">
                  <SelectValue placeholder="Select payment form" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="payment_method_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Payment Method</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="border-invoice-200 focus:border-invoice-500">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="10">Cash Payment</SelectItem>
                <SelectItem value="20">Check</SelectItem>
                <SelectItem value="30">Card</SelectItem>
                <SelectItem value="40">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="payment_due_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Payment Due Date</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || undefined}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
