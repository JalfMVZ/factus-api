import { Control } from "react-hook-form";
import { Invoice } from "../schema/invoice.schema";

export interface InvoiceBasicFormProps {
  control: Control<Invoice>;
}

export interface NumberingRangeResponse {
  id: number;
  document: string;
  prefix: string;
  from: number;
  to: number;
  resolution_number: string;
  is_active: number; 
}

export interface Tribute {
  id: number;
  code: string;
  name: string;
  rate: number;
  type: "tax" | "withholding";
}

export interface Municipality {
  id: number;
  code: string;
  name: string;
  department_code?: string;
  country_code?: string;
}

export interface InvoiceItemFormProps {
  control: Control<Invoice>;
  index: number;
  onRemove: () => void;
  showRemoveButton: boolean;
}

export interface MeasurementUnit {
  id: number;
  code: string;
  name: string;
  description?: string;
  equivalence?: number;
}

export interface RelatedDocument {
  code: string;
  issue_date: string;
  number: string;
  type: "credit_note" | "debit_note";
}

export interface WithholdingTax {
  code: string;
  withholding_tax_rate: string;
}
