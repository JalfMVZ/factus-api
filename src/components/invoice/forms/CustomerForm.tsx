import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { InvoiceFormValues } from "../schema/invoice.schema";

export function CustomerForm({
  control,
}: {
  control: Control<InvoiceFormValues>;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <FormField
        control={control}
        name="customer.identification"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Identification</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter identification"
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
        name="customer.dv"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">DV</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter DV"
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
        name="customer.company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Company</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter company name"
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
        name="customer.trade_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Trade Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter trade name"
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
        name="customer.names"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Names</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter names"
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
        name="customer.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Address</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter address"
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
        name="customer.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Enter email"
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
        name="customer.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Phone</FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="Enter phone"
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
        name="customer.legal_organization_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">
              Legal Organization ID
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter legal organization ID"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
