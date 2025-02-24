export interface Factura {
  id: number;
  number: string;
  status: 1 | 0;
  created_at: string;
  names: string;
  identification: string;
  document: {
    name: string;
  };
  total: string;
}

export interface FacturaCardProps {
  factura: Factura;
  onSelect: () => void;
}

export interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface FacturasListProps {
  bills: Factura[];
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  token: string;
}

export interface BillsResponse {
  bills: Factura[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export interface BillDetail {
  company: {
    name: string;
    nit: string;
    address: string;
    phone: string;
    email: string;
  };
  customer: {
    names: string;
    identification: string;
    address: string;
    email: string;
  };
  bill: {
    number: string;
    created_at: string;
    total: string;
    qr: string;
    qr_image: string;
    status: number;
    payment_form: {
      name: string;
    };
  };
  items: {
    name: string;
    quantity: number;
    price: string;
    total: number;
  }[];
  withholding_taxes: {
    name: string;
    value: string;
  }[];
}

export interface FacturaDetailProps {
  billNumber: string;
  onClose?: () => void;
}
