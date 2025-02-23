"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { InvoiceFormValues, formSchema } from "../schema/invoice.schema";
import { CustomerForm } from "./CustomerForm";
import { InvoiceBasicForm } from "./InvoiceBasicForm";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { DatePicker } from "@/components/datapicker/DataPicker";
import { validateBill } from "@/services/invoices";

export default function InvoiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numbering_range_id: 1,
      reference_code: "",
      observation: "",
      payment_form: "",
      payment_method_code: "",
      payment_due_date: new Date(),
      billing_period: {
        start_date: new Date(),
        start_time: "00:00",
        end_date: new Date(),
        end_time: "23:59",
      },
      customer: {
        identification: "",
        dv: "",
        company: "",
        trade_name: "",
        names: "",
        address: "",
        email: "",
        phone: "",
        legal_organization_id: "",
        tribute_id: 1,
        identification_document_id: "",
        municipality_id: 1,
      },
      items: [
        {
          tribute_id: 1,
          code_reference: "",
          name: "",
          quantity: 1,
          discount_rate: 0,
          price: 0,
          tax_rate: "0.00",
          unit_measure_id: 70,
          standard_code_id: 1,
          is_excluded: 0,
          withholding_taxes: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  async function onSubmit(values: InvoiceFormValues) {
    try {
      setIsSubmitting(true);
      console.log("Form values:", values);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const validationResult = await validateBill(values, token);
      console.log("Validation successful:", validationResult);
    } catch (error: any) {
      if (error.name === "BillValidationError") {
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Error submitting form:", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-invoice-50 border-b border-invoice-100">
            <CardTitle className="text-2xl font-bold text-invoice-900">
              Generate Invoice
            </CardTitle>
            <CardDescription className="text-invoice-700">
              Create a new invoice with customer and item details.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 p-6">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-invoice-800">
                Basic Information
              </h3>
              <InvoiceBasicForm control={form.control} />
            </div>

            <Separator className="bg-invoice-100" />

            {/* Billing Period Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-invoice-800">
                Billing Period
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="billing_period.start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-invoice-700">
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_period.start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-invoice-700">
                        Start Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          className="border-invoice-200 focus:border-invoice-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_period.end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-invoice-700">
                        End Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_period.end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-invoice-700">
                        End Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          className="border-invoice-200 focus:border-invoice-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="bg-invoice-100" />

            {/* Customer Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-invoice-800">
                Customer Information
              </h3>
              <CustomerForm control={form.control} />
            </div>

            <Separator className="bg-invoice-100" />

            {/* Invoice Items Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-invoice-800">
                  Invoice Items
                </h3>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      tribute_id: 1,
                      code_reference: "",
                      name: "",
                      quantity: 1,
                      discount_rate: 0,
                      price: 0,
                      tax_rate: "0.00",
                      unit_measure_id: 70,
                      standard_code_id: 1,
                      is_excluded: 0,
                      withholding_taxes: [],
                    })
                  }
                  className="bg-invoice-500 hover:bg-invoice-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <InvoiceItemForm
                  key={field.id}
                  control={form.control}
                  index={index}
                  onRemove={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            className="bg-invoice-500 hover:bg-invoice-600 text-white px-8 py-2 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Validating..." : "Generate Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
