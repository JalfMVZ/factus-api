"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BillDetail, FacturaDetailProps } from "../invoices-interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBillDetail } from "@/services/bills-detail";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export default function FacturaDetail({
  billNumber,
  onClose,
}: FacturaDetailProps) {
  const { token, loading: authLoading } = useAuth();
  const [billData, setBillData] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchBillDetail = async () => {
      try {
        if (!token) throw new Error("No autenticado");

        const data = await getBillDetail(token, billNumber);
        setBillData(data.data);
      } catch (err) {
        console.error("Error fetching bill:", err);
        setError(err instanceof Error ? err.message : "Error cargando factura");
      } finally {
        setLoading(false);
      }
    };

    fetchBillDetail();
  }, [token, authLoading, billNumber]);

  if (authLoading || loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-invoice-600">Cargando detalles de la factura...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg text-center max-w-md">
          <p className="text-danger-600 mb-4">{error}</p>
          <Link
            href="/invoices"
            className="inline-block text-invoice-600 hover:text-invoice-700 underline"
          >
            ← Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  if (!billData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white shadow-xl">
        <CardHeader className="border-b border-secondary-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-invoice-600 text-2xl font-bold">
              Factura {billNumber}
            </CardTitle>
            {onClose && (
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-secondary-500 hover:text-invoice-600"
              >
                ✕
              </Button>
            )}
          </div>
        </CardHeader>

        <ScrollArea className="h-[80vh]">
          <CardContent className="p-6 space-y-8">
            {/* Sección Información Empresa y Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-secondary-900 mb-3 border-b pb-2">
                  Emisor
                </h3>
                <div className="space-y-1.5">
                  <p className="font-medium">{billData.company.name}</p>
                  <p className="text-sm">
                    <span className="text-secondary-600">NIT:</span>{" "}
                    {billData.company.nit}
                  </p>
                  <p className="text-sm">{billData.company.address}</p>
                  <p className="text-sm">Tel: {billData.company.phone}</p>
                  <p className="text-sm text-invoice-600">
                    {billData.company.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-secondary-900 mb-3 border-b pb-2">
                  Cliente
                </h3>
                <div className="space-y-1.5">
                  <p className="font-medium">{billData.customer.names}</p>
                  <p className="text-sm">
                    <span className="text-secondary-600">ID:</span>{" "}
                    {billData.customer.identification}
                  </p>
                  <p className="text-sm">{billData.customer.address}</p>
                  <p className="text-sm text-invoice-600">
                    {billData.customer.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla de Artículos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-secondary-900 border-b pb-2">
                Detalle de Artículos
              </h3>
              <Table className="border rounded-lg overflow-hidden">
                <TableHeader className="bg-secondary-50">
                  <TableRow>
                    <TableHead className="font-semibold">Producto</TableHead>
                    <TableHead className="font-semibold text-center">
                      Cantidad
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Precio Unitario
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billData.items.map((item, index) => (
                    <TableRow key={index} className="hover:bg-secondary-50">
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${item.total.toLocaleString("es-CO")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Sección de Impuestos */}
            {billData.withholding_taxes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-secondary-900 border-b pb-2">
                  Retenciones y Impuestos
                </h3>
                <div className="space-y-3">
                  {billData.withholding_taxes.map((tax, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-secondary-50 p-3 rounded-lg"
                    >
                      <span className="text-sm font-medium">{tax.name}</span>
                      <span className="text-sm font-semibold text-invoice-600">
                        ${tax.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resumen Final */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-secondary-50 p-4 rounded-lg">
                  <span className="font-semibold text-lg">Total Factura:</span>
                  <span className="text-invoice-600 font-bold text-xl">
                    ${parseFloat(billData.bill.total).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-secondary-600">
                  <p>
                    <span className="font-medium">Forma de pago:</span>{" "}
                    {billData.bill.payment_form.name}
                  </p>
                  <p>
                    <span className="font-medium">Fecha de emisión:</span>{" "}
                    {new Date(billData.bill.created_at).toLocaleDateString(
                      "es-CO"
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Estado:</span>
                    <Badge>
                      {billData.bill.status === 1 ? "Validada" : "Pendiente"}
                    </Badge>
                  </p>
                </div>
              </div>

              {billData.bill.qr_image && (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="bg-white p-3 rounded-lg border">
                    <img
                      src={billData.bill.qr_image.replace(/\s+/g, "")}
                      alt="Código QR de la factura"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-sm text-secondary-600 text-center">
                    Escanee el código QR para verificar la factura
                  </p>
                </div>
              )}

              {billData.bill.qr && (
                <div className="text-center mt-4">
                  <a
                    href={billData.bill.qr}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-invoice-600 hover:text-invoice-700 underline text-sm"
                  >
                    Dale click aquí para verificar la factura en la DIAN
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
