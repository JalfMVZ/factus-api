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
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Control, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllMeasurementUnits } from "@/services/measurement-units";
import { standardCodes } from "../data/standardCodes";
import { Invoice } from "../schema/invoice.schema";
import { MeasurementUnit, Tribute } from "../interfaces/inoiceForm";
import { getAllTributes } from "@/services/tributes";

interface InvoiceItemFormProps {
  control: Control<Invoice>;
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${index}.withholding_taxes`,
  });

  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [measureUnits, setMeasureUnits] = useState<MeasurementUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No se encontró token de autenticación");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [unitsData, tributesData] = await Promise.all([
          getAllMeasurementUnits(token),
          getAllTributes(token),
        ]);

        if (!Array.isArray(unitsData) || !Array.isArray(tributesData)) {
          throw new Error("Formato de datos inválido");
        }

        setMeasureUnits(unitsData);
        setTributes(tributesData);
        setError(null);
      } catch (err) {
        console.error("Error cargando recursos:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Card className="mb-6 border-invoice-100">
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Code Reference */}
          <FormField
            control={control}
            name={`items.${index}.code_reference`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Referencia</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: PROD-001"
                    {...field}
                    className="border-2 border-invoice-300 focus:border-invoice-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Nombre del Producto */}
          <FormField
            control={control}
            name={`items.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto/Servicio</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Servicio de Consultoría"
                    {...field}
                    className="border-2 border-invoice-300 focus:border-invoice-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Cantidad */}
          <FormField
            control={control}
            name={`items.${index}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-2 border-invoice-300 focus:border-invoice-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Precio Unitario */}
          <FormField
            control={control}
            name={`items.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Unitario</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-2 border-invoice-300 focus:border-invoice-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Descuento */}
          <FormField
            control={control}
            name={`items.${index}.discount_rate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descuento (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-2 border-invoice-300 focus:border-invoice-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Impuesto */}
          <FormField
            control={control}
            name={`items.${index}.tax_rate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>IVA (%)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="0.00"
                >
                  <FormControl>
                    <SelectTrigger className="border-2 border-invoice-300 focus:border-invoice-500">
                      <SelectValue placeholder="Seleccione IVA" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border border-invoice-300 rounded-lg">
                    <SelectItem value="0.00">0%</SelectItem>
                    <SelectItem value="5.00">5%</SelectItem>
                    <SelectItem value="19.00">19%</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Unidad de Medida */}
          <FormField
            control={control}
            name={`items.${index}.unit_measure_id`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad de Medida</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                  disabled={loading || authLoading || !!error}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`border-2 border-invoice-300 focus:border-invoice-500 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={
                          loading
                            ? "Cargando unidades..."
                            : error || "Seleccione unidad"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border border-invoice-300 rounded-lg">
                    {measureUnits.map((unit) => (
                      <SelectItem
                        key={unit.id}
                        value={unit.id.toString()}
                        className="hover:bg-invoice-100"
                      >
                        {unit.name} ({unit.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error && (
                  <FormMessage className="text-red-500 text-sm">
                    {error}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Código Estándar */}
          <FormField
            control={control}
            name={`items.${index}.standard_code_id`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Estándar</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="border-2 border-invoice-300 focus:border-invoice-500">
                      <SelectValue placeholder="Seleccione código" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border border-invoice-300 rounded-lg">
                    {standardCodes.map((code) => (
                      <SelectItem
                        key={code.id}
                        value={code.id.toString()}
                        className="hover:bg-invoice-100"
                      >
                        {code.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          {/* Excluido de IVA */}
          <FormField
            control={control}
            name={`items.${index}.is_excluded`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value === 1}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? 1 : 0)
                    }
                    className="border-2 border-invoice-300 data-[state=checked]:bg-invoice-500"
                  />
                </FormControl>
                <FormLabel>¿Excluido de IVA?</FormLabel>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
        </div>

        {/* Tribute ID */}
        <FormField
          control={control}
          name={`items.${index}.tribute_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tributo del Producto</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={loading || authLoading || !!error}
              >
                <FormControl>
                  <SelectTrigger className="border-2 border-invoice-300">
                    <SelectValue
                      placeholder={
                        loading ? "Cargando tributos..." : "Seleccione tributo"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border border-invoice-300">
                  {tributes.map((tribute) => (
                    <SelectItem
                      key={tribute.id}
                      value={tribute.id.toString()}
                      className="hover:bg-invoice-100"
                    >
                      {tribute.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Retenciones */}
        <div className="space-y-4">
          <FormLabel className="text-invoice-700 font-medium">
            Retenciones
          </FormLabel>

          {fields.map((field, taxIndex) => (
            <div key={field.id} className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`items.${index}.withholding_taxes.${taxIndex}.code`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="border-2 border-invoice-300">
                            <SelectValue placeholder="Código retención" />
                          </SelectTrigger>
                          <SelectContent className="border border-invoice-300">
                            <SelectItem value="01">Renta</SelectItem>
                            <SelectItem value="02">IVA</SelectItem>
                            <SelectItem value="03">ICA</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`items.${index}.withholding_taxes.${taxIndex}.withholding_tax_rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Porcentaje (ej: 7.00)"
                          {...field}
                          className="border-2 border-invoice-300"
                          pattern="\d+(\.\d{1,2})?"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(taxIndex)}
                className="mt-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ code: "01", withholding_tax_rate: "0.00" })}
            className="text-invoice-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Agregar Retención
          </Button>
        </div>

        {showRemoveButton && (
          <Button
            type="button"
            variant="destructive"
            onClick={onRemove}
            className="mt-4"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Ítem
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
