import * as z from "zod";

export const invoiceItemSchema = z.object({
  code_reference: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  discount_rate: z.number().min(0).max(100),
  price: z.number().min(0),
  tax_rate: z.string(),
  unit_measure_id: z.number(),
  standard_code_id: z.number(),
  is_excluded: z.number(),
  tribute_id: z.number(),
  withholding_taxes: z.array(
    z.object({
      code: z.string(),
      withholding_tax_rate: z.string(),
    })
  ),
});

export const formSchema = z.object({
  numbering_range_id: z.number(),
  reference_code: z.string(),
  observation: z.string(),
  payment_form: z.string(),
  payment_due_date: z.date(),
  payment_method_code: z.string(),
  billing_period: z.object({
    start_date: z.date(),
    start_time: z.string(),
    end_date: z.date(),
    end_time: z.string(),
  }),
  customer: z.object({
    identification: z.string(),
    dv: z.string(),
    company: z.string(),
    trade_name: z.string(),
    names: z.string(),
    address: z.string(),
    email: z.string().email(),
    phone: z.string(),
    legal_organization_id: z.string(),
    tribute_id: z.number(),
    identification_document_id: z.string(),
    municipality_id: z.number(),
  }),
  items: z.array(invoiceItemSchema),
});

export type InvoiceFormValues = z.infer<typeof formSchema>;
