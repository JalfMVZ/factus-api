import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FacturaCard } from "./FacturaCard";
import { FacturasListProps } from "../interfaces/invoices-interface";

const generateVisiblePages = (
  current: number,
  total: number
): (number | string)[] => {
  const visiblePages = 2;
  const pages: (number | string)[] = [];

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  pages.push(1);
  if (current > visiblePages + 2) pages.push("...");

  const start = Math.max(2, current - visiblePages);
  const end = Math.min(total - 1, current + visiblePages);

  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - visiblePages - 1) pages.push("...");

  pages.push(total);

  return pages.filter(
    (page, index, array) =>
      page !== array[index - 1] || typeof page !== "string"
  );
};

export const FacturasList = ({
  bills,
  pagination,
  onPageChange,
}: FacturasListProps) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.last_page) onPageChange(newPage);
  };

  const visiblePages = generateVisiblePages(
    pagination.current_page,
    pagination.last_page
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bills.map((factura) => (
          <FacturaCard key={factura.id} factura={factura} />
        ))}
      </div>

      {pagination.last_page > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                className={
                  pagination.current_page === 1
                    ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                    : "hover:bg-secondary-100"
                }
              />
            </PaginationItem>

            {visiblePages.map((page, index) => (
              <PaginationItem key={index}>
                {typeof page === "string" ? (
                  <span className="px-3 py-1.5 text-secondary-500">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === pagination.current_page}
                    onClick={() => handlePageChange(page)}
                    className={
                      page === pagination.current_page
                        ? "bg-invoice-100 text-invoice-700 hover:bg-invoice-200 font-medium"
                        : "hover:bg-secondary-100 text-secondary-600"
                    }
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                className={
                  pagination.current_page === pagination.last_page
                    ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                    : "hover:bg-secondary-100"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
