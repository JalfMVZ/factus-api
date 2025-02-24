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
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { CustomerForm } from "./CustomerForm";
import { InvoiceBasicForm } from "./InvoiceBasicForm";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { DatePicker } from "@/components/datapicker/DataPicker";
import { processInvoice } from "@/services/invoices";
import { BillValidationError } from "@/errors/billCreationError";
import { Invoice, InvoiceSchema } from "../schema/invoice.schema";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { formatZodErrors } from "@/lib/formatZodErrors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function InvoiceForm() {
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>(
    {}
  );

  const { token } = useAuth();

  const form = useForm<Invoice>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      numbering_range_id: 1,
      reference_code: "",
      observation: "",
      payment_form: "1",
      payment_method_code: "10",
      payment_due_date: new Date().toISOString().split("T")[0],
      billing_period: {
        start_date: new Date().toISOString().split("T")[0],
        start_time: "00:00:00",
        end_date: new Date().toISOString().split("T")[0],
        end_time: "23:59:59",
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
          code_reference: "",
          name: "",
          quantity: 1,
          discount_rate: 0,
          price: 0,
          tax_rate: "0.00",
          unit_measure_id: 70,
          standard_code_id: 1,
          is_excluded: 0,
          tribute_id: 1,
          withholding_taxes: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleFormError = (errors: typeof form.formState.errors) => {
    const parsedErrors = formatZodErrors(errors);
    setServerErrors(parsedErrors);
  };

  async function onSubmit(values: Invoice) {
    try {
      setIsSubmitting(true);
      setServerErrors({});
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      const result = await processInvoice(values, token);
      toast.success("Factura generada exitosamente", {
        description: "La factura ha sido procesada y guardada correctamente.",
        duration: 5000,
        style: {
          background: "#10B981",
          color: "white",
        },
        action: {
          label: "Ver factura",
          onClick: () =>
            navigate.push(`/invoices/${(result as any).data.bill.number}`),
        },
      });
      form.reset();
    } catch (error) {
      if (error instanceof BillValidationError) {
        const errorMap = error.errors;
        setServerErrors(errorMap);
        Object.entries(errorMap).forEach(([path, messages]) => {
          form.setError(path as any, {
            type: "manual",
            message: messages.join(", "),
          });
        });
        toast.error("Error de validación", {
          description: "Por favor revise los campos marcados en rojo.",
          duration: 5000,
          style: {
            background: "#EF4444",
            color: "white",
            fontWeight: "500",
          },
        });
      } else {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        setServerErrors({
          _form: [message],
        });
        toast.error("Error al procesar la factura", {
          description: message,
          duration: 5000,
          style: {
            background: "#EF4444",
            color: "white",
            fontWeight: "500",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, handleFormError)}
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-invoice-50 border-b border-invoice-100">
            <CardTitle className="text-2xl font-bold text-invoice-900">
              Generar Factura Electrónica
            </CardTitle>
            <CardDescription className="text-invoice-700">
              Complete todos los campos requeridos para emitir la factura
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 p-6">
            {/* Sección Información Básica */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-invoice-800">
                Información General
              </h3>
              <InvoiceBasicForm control={form.control} />
              {serverErrors.general && (
                <div className="text-red-500 text-sm">
                  {serverErrors.general.join(", ")}
                </div>
              )}
            </div>

            <Separator className="bg-invoice-100" />

            {/* Período de Facturación */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-invoice-800">
                Período Facturación
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="billing_period.start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Inicio</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          error={
                            !!form.formState.errors.billing_period?.start_date
                          }
                          errorMessage={
                            form.formState.errors.billing_period?.start_date
                              ?.message
                          }
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
                      <FormLabel>Hora Inicio</FormLabel>
                      <FormControl>
                        <Input type="time" step="1" {...field} />
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
                      <FormLabel>Fecha Fin</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          error={
                            !!form.formState.errors.billing_period?.end_date
                          }
                          errorMessage={
                            form.formState.errors.billing_period?.end_date
                              ?.message
                          }
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
                      <FormLabel>Hora Fin</FormLabel>
                      <FormControl>
                        <Input type="time" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="bg-invoice-100" />

            {/* Datos del Cliente */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-invoice-800">
                Información del Cliente
              </h3>
              <CustomerForm control={form.control} />
            </div>

            <Separator className="bg-invoice-100" />

            {/* Items de la Factura */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-invoice-800">
                  Detalle de Productos/Servicios
                </h3>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      code_reference: "",
                      name: "",
                      quantity: 1,
                      discount_rate: 0,
                      price: 0,
                      tax_rate: "0.00",
                      unit_measure_id: 70,
                      standard_code_id: 1,
                      is_excluded: 0,
                      tribute_id: 1,
                      withholding_taxes: [],
                    })
                  }
                  className="bg-invoice-500 hover:bg-invoice-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Item
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
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Procesando...
              </span>
            ) : (
              "Generar Factura"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
