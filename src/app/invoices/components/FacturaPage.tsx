"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getAllBills } from "@/services/bills";
import { FacturasList } from "./FacturasList";
import { Skeleton } from "@/components/ui/skeleton";
import { BillsResponse } from "../invoices-interface";

export default function FacturasPage() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    number: "",
    identification: "",
    names: "",
    status: "",
  });
  const [billsData, setBillsData] = useState<BillsResponse>({
    bills: [],
    pagination: {
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
      from: 0,
      to: 0,
    },
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
    if (storedToken) loadBills(storedToken);
  }, [page]);

  const loadBills = async (token: string) => {
    try {
      setLoading(true);
      const data = await getAllBills(token, filters, page);
      setBillsData(data);
    } catch (error) {
      console.error("Error cargando facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setPage(1);
    if (token) loadBills(token);
  };

  if (!token) {
    return (
      <div className="p-6 text-center text-danger-600">
        No se encontró token de autenticación
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-invoice-900 mb-8">
        Gestión de Facturas
      </h1>

      {/* Filtros */}
      <div className="bg-secondary-50 p-4 rounded-lg mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por numero de Factura"
            value={filters.number}
            onChange={(e) => handleFilterChange("number", e.target.value)}
          />
          <Input
            placeholder="Buscar por nombre"
            value={filters.names}
            onChange={(e) => handleFilterChange("names", e.target.value)}
          />
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Validadas</SelectItem>
              <SelectItem value="0">Pendientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleSearch}
          className="bg-invoice-500 hover:bg-invoice-600"
        >
          Aplicar Filtros
        </Button>
      </div>

      {/* Listado y carga */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <FacturasList
          bills={billsData.bills}
          pagination={billsData.pagination}
          onPageChange={setPage}
        />
      )}

      {/* Mensaje sin resultados */}
      {!loading && billsData.bills.length === 0 && (
        <div className="text-center py-12 text-secondary-500">
          No se encontraron facturas con los filtros aplicados
        </div>
      )}
    </div>
  );
}
