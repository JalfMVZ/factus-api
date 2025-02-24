import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Factura } from "../interfaces/invoices-interface";

interface FacturaCardProps {
  factura: Factura;
}

export const FacturaCard = ({ factura }: FacturaCardProps) => {
  const statusColors: Record<1 | 0, { bg: string; text: string }> = {
    1: { bg: "bg-success-100", text: "text-success-700" },
    0: { bg: "bg-warning-100", text: "text-warning-700" },
  };

  return (
    <Link href={`/invoices/${factura.number}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-invoice-600 text-lg">
              #{factura.number}
            </CardTitle>
            <Badge
              className={`${statusColors[factura.status].bg} ${
                statusColors[factura.status].text
              }`}
            >
              {factura.status === 1 ? "Validada" : "Pendiente por Validar"}
            </Badge>
          </div>
          <p className="text-secondary-600 text-sm">{factura.created_at}</p>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div>
              <h3 className="font-medium text-secondary-900">
                {factura.names}
              </h3>
              <p className="text-secondary-500 text-sm">
                {factura.identification}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-secondary-500">
                {factura.document.name}
              </span>
              <span className="text-lg font-semibold text-invoice-500">
                ${parseFloat(factura.total).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
