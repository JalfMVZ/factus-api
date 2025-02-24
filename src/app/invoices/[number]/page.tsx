// app/invoices/[number]/page.tsx

import FacturaDetail from "../components/FacturaDetail";

interface PageProps {
  params: {
    number: string;
  };
}

export default async function Page({ params }: PageProps) {
  return <FacturaDetail billNumber={params.number} />;
}
