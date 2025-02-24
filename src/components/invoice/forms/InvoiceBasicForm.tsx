import { Controller, useFormContext } from "react-hook-form";
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
import { numberingRanges } from "@/services/numbering-ranges";
import { useAuth } from "@/hooks/useAuth";
import { paymentMethods } from "../data/paymentMethods";
import {
  InvoiceBasicFormProps,
  NumberingRangeResponse,
} from "../interfaces/inoiceForm";
import { Invoice } from "../schema/invoice.schema";

export function InvoiceBasicForm({ control }: InvoiceBasicFormProps) {
  const [ranges, setRanges] = useState<NumberingRangeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formState } = useFormContext<Invoice>();
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchRanges = async () => {
      if (!token) {
        setError("No se encontró token de autenticación");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await numberingRanges(token);

        if (!Array.isArray(data)) {
          throw new Error("Formato de datos inválido");
        }

        const validRanges = data
          .filter((range) => range.is_active === 1)
          .map((range) => ({
            id: range.id,
            document: range.document,
            prefix: range.prefix,
            from: range.from,
            to: range.to,
            resolution_number: range.resolution_number,
            is_active: range.is_active, 
          }));

        setRanges(validRanges);
        setError(null);
      } catch (err) {
        console.error("Error obteniendo rangos:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchRanges();
  }, [token]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Numbering Range */}
      <FormField
        control={control}
        name="numbering_range_id"
        render={({ field }) => {
          const formatInvoiceNumber = (num: number) => {
            return num.toString().padStart(9, "0");
          };

          return (
            <FormItem>
              <FormLabel className="text-invoice-700 font-medium">
                Rango de Numeración
              </FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={loading || !!error}
              >
                <FormControl>
                  <SelectTrigger className="w-full min-h-[40px] bg-white border-2 border-invoice-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-invoice-500 focus:border-invoice-500">
                    <SelectValue
                      placeholder={
                        loading
                          ? "Cargando rangos..."
                          : error
                          ? "Error cargando rangos"
                          : "Seleccione un rango"
                      }
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="bg-white border border-invoice-300 rounded-lg shadow-lg">
                  {ranges.map((range) => (
                    <SelectItem
                      key={range.id}
                      value={range.id.toString()}
                      className="px-4 py-2 hover:bg-invoice-100 text-invoice-700"
                    >
                      {`${range.document} - ${
                        range.prefix
                      } (${formatInvoiceNumber(
                        range.from
                      )}-${formatInvoiceNumber(range.to)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {error && (
                <FormMessage className="text-red-500">{error}</FormMessage>
              )}
            </FormItem>
          );
        }}
      />

      {/* Reference Code */}
      <FormField
        control={control}
        name="reference_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">
              Código de Referencia
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ej: FACT-2023"
                className="border-2 border-invoice-300 focus:border-invoice-500 focus:ring-2 focus:ring-invoice-500"
                maxLength={20}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Observation */}
      <FormField
        control={control}
        name="observation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Observaciones</FormLabel>
            <FormControl>
              <Input
                placeholder="Observaciones adicionales"
                className="border-2 border-invoice-300 focus:border-invoice-500 focus:ring-2 focus:ring-invoice-500"
                maxLength={250}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Payment Form */}
      <FormField
        control={control}
        name="payment_form"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Forma de Pago</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue="1"
            >
              <FormControl>
                <SelectTrigger className="border-2 border-invoice-300 focus:border-invoice-500 focus:ring-2 focus:ring-invoice-500">
                  <SelectValue placeholder="Seleccione forma de pago" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border border-invoice-300 rounded-lg">
                <SelectItem value="1" className="text-invoice-700">
                  Contado
                </SelectItem>
                <SelectItem value="2" className="text-invoice-700">
                  Crédito
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Payment Method */}
      <FormField
        control={control}
        name="payment_method_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Método de Pago</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue="10"
            >
              <FormControl>
                <SelectTrigger className="border-2 border-invoice-300 focus:border-invoice-500 focus:ring-2 focus:ring-invoice-500">
                  <SelectValue placeholder="Seleccione método" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border border-invoice-300 rounded-lg">
                {paymentMethods.map((method) => (
                  <SelectItem
                    key={method.code}
                    value={method.code}
                    className="text-invoice-700"
                  >
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Payment Due Date */}
      <FormField
        control={control}
        name="payment_due_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">
              Fecha de Vencimiento
            </FormLabel>
            <FormControl>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                error={!!formState.errors.payment_due_date}
                errorMessage={formState.errors.payment_due_date?.message}
                className="border-2 border-invoice-300 rounded-lg focus:ring-2 focus:ring-invoice-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
