import { Card, CardContent } from "@/components/ui/card";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Control } from "react-hook-form";
import { InvoiceFormValues } from "../schema/invoice.schema";

interface InvoiceItemFormProps {
  control: Control<InvoiceFormValues>;
  index: number;
  onRemove: () => void;
  showRemoveButton: boolean;
}

export function InvoiceItemForm({
  control,
  index,
  onRemove,
  showRemoveButton,
}: InvoiceItemFormProps) {
  return (
    <Card className="mb-6 border-invoice-100">
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={control}
            name={`items.${index}.code_reference`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-invoice-700">
                  Code Reference
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter code reference"
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
            name={`items.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-invoice-700">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter item name"
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
            name={`items.${index}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-invoice-700">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    className="border-invoice-200 focus:border-invoice-500"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`items.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-invoice-700">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    className="border-invoice-200 focus:border-invoice-500"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`items.${index}.discount_rate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-invoice-700">
                  Discount Rate (%)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Enter discount rate"
                    className="border-invoice-200 focus:border-invoice-500"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`items.${index}.tax_rate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-invoice-700">Tax Rate</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-invoice-200 focus:border-invoice-500">
                      <SelectValue placeholder="Select tax rate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0.00">0%</SelectItem>
                    <SelectItem value="0.19">19%</SelectItem>
                    <SelectItem value="0.05">5%</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showRemoveButton && (
          <Button
            type="button"
            onClick={onRemove}
            className="bg-danger-500 hover:bg-danger-600 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
