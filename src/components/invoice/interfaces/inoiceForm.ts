import { Control } from "react-hook-form";
import { InvoiceFormValues } from "../schema/invoice.schema";

export interface InvoiceBasicFormProps {
  control: Control<InvoiceFormValues>;
}

export interface NumberingRange {
  id: number;
  name: string;
}
