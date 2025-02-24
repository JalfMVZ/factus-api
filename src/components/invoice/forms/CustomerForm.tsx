import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Invoice } from "../schema/invoice.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { documentTypes } from "../data/documentTypes";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getAllTributes } from "@/services/tributes";
import { Municipality, Tribute } from "../interfaces/inoiceForm";
import { getAllMunicipalities } from "@/services/municipalities";
import { Button } from "@/components/ui/button";
import { legalOrganizations } from "../data/legalOrganizations";
import { customerTributes } from "../data/customerTributes";

export function CustomerForm({ control }: { control: Control<Invoice> }) {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [visibleMunicipalities, setVisibleMunicipalities] = useState<
    Municipality[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const municipalitiesPerPage = 20;

  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const fetchData = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [tributesData, municipalitiesData] = await Promise.all([
          getAllTributes(token),
          getAllMunicipalities(token),
        ]);

        setTributes(Array.isArray(tributesData) ? tributesData : []);
        setMunicipalities(
          Array.isArray(municipalitiesData) ? municipalitiesData : []
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, authLoading]);

  useEffect(() => {
    setVisibleMunicipalities(
      municipalities.slice(0, page * municipalitiesPerPage)
    );
  }, [municipalities, page]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Identification */}
      <FormField
        control={control}
        name="customer.identification"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Identificación</FormLabel>
            <FormControl>
              <Input
                placeholder="Número de identificación"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* DV */}
      <FormField
        control={control}
        name="customer.dv"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">DV</FormLabel>
            <FormControl>
              <Input
                placeholder="Dígito de verificación"
                className="border-invoice-200 focus:border-invoice-500"
                maxLength={1}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Company */}
      <FormField
        control={control}
        name="customer.company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Razón Social</FormLabel>
            <FormControl>
              <Input
                placeholder="Nombre legal de la empresa"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Trade Name */}
      <FormField
        control={control}
        name="customer.trade_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Nombre Comercial</FormLabel>
            <FormControl>
              <Input
                placeholder="Nombre comercial (opcional)"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Names */}
      <FormField
        control={control}
        name="customer.names"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Nombres</FormLabel>
            <FormControl>
              <Input
                placeholder="Nombres completos"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address */}
      <FormField
        control={control}
        name="customer.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Dirección</FormLabel>
            <FormControl>
              <Input
                placeholder="Dirección completa"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={control}
        name="customer.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">
              Correo Electrónico
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="correo@empresa.com"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone */}
      <FormField
        control={control}
        name="customer.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">Teléfono</FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="Número de contacto"
                className="border-invoice-200 focus:border-invoice-500"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Legal Organization */}
      <FormField
        control={control}
        name="customer.legal_organization_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700 font-medium">
              Tipo de Organización
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue=""
            >
              <FormControl>
                <SelectTrigger className="w-full min-h-[40px] bg-white border-2 border-invoice-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-invoice-500 focus:border-invoice-500">
                  <SelectValue placeholder="Seleccione tipo de organización" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border border-invoice-300 rounded-lg shadow-lg">
                {legalOrganizations.map((org) => (
                  <SelectItem
                    key={org.id}
                    value={org.id.toString()}
                    className="px-4 py-2 hover:bg-invoice-100 text-invoice-700"
                  >
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tribute */}
      <FormField
        control={control}
        name="customer.tribute_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700 font-medium">
              Tributo del Cliente
            </FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger className="w-full min-h-[40px] bg-white border-2 border-invoice-300 rounded-lg px-4 py-2">
                  <SelectValue placeholder="Seleccione tributo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border border-invoice-300 rounded-lg shadow-lg">
                {customerTributes.map((tribute) => (
                  <SelectItem
                    key={tribute.id}
                    value={tribute.id.toString()}
                    className="px-4 py-2 hover:bg-invoice-100 text-invoice-700"
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

      {/* Identification Document */}
      <FormField
        control={control}
        name="customer.identification_document_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700">
              Tipo de Documento
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue=""
            >
              <FormControl>
                <SelectTrigger className="border-2 border-invoice-300 focus:border-invoice-500 focus:ring-2 focus:ring-invoice-500">
                  <SelectValue placeholder="Seleccione tipo de documento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="border border-invoice-300 rounded-lg">
                {documentTypes.map((doc) => (
                  <SelectItem
                    key={doc.id}
                    value={doc.id}
                    className="text-invoice-700"
                  >
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Municipality */}
      <FormField
        control={control}
        name="customer.municipality_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-invoice-700 font-medium">
              Municipio
            </FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
              disabled={loading || authLoading || !!error}
            >
              <FormControl>
                <SelectTrigger
                  className={`w-full min-h-[40px] bg-white border-2 rounded-lg px-4 py-2 
                    ${error ? "border-red-500" : "border-invoice-300"}
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <SelectValue
                    placeholder={
                      loading
                        ? "Cargando municipios..."
                        : "Seleccione municipio"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border border-invoice-300 rounded-lg shadow-lg">
                {visibleMunicipalities.map((municipality) => (
                  <SelectItem
                    key={municipality.id}
                    value={municipality.id.toString()}
                    className="px-4 py-2 hover:bg-invoice-100 text-invoice-700"
                  >
                    {municipality.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {municipalities.length > visibleMunicipalities.length && (
              <Button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                className="mt-2 text-sm bg-invoice-100 hover:bg-invoice-200 text-invoice-700"
                variant="ghost"
              >
                Cargar más municipios
              </Button>
            )}

            {error && (
              <FormMessage className="text-red-500">{error}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
