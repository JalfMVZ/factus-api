import { z } from "zod";

// Validaciones reutilizables
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
const decimalRegex = /^\d+(\.\d{1,2})?$/;

// Esquemas componentes
const WithholdingTaxSchema = z.object({
  code: z.string().min(2).max(2),
  withholding_tax_rate: z
    .string()
    .regex(decimalRegex, "Formato decimal inválido"),
});

const BillingPeriodSchema = z
  .object({
    start_date: z.string().regex(dateRegex),
    start_time: z.string().regex(timeRegex).optional(),
    end_date: z.string().regex(dateRegex),
    end_time: z.string().regex(timeRegex).optional(),
  })
  .optional();

const CustomerSchema = z
  .object({
    identification_document_id: z.string(),
    identification: z.string().min(5).max(20),
    dv: z.string().length(1).optional(),
    company: z.string().optional(),
    trade_name: z.string().optional(),
    names: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().min(7).max(15).optional(),
    legal_organization_id: z.string(),
    tribute_id: z.number().int().positive(),
    municipality_id: z.number().int().positive().optional(),
  })
  .refine(
    (data) => data.company || data.names,
    "Debe proveer razón social o nombres del cliente"
  );

const ItemSchema = z.object({
  code_reference: z.string().min(1),
  name: z.string().min(3).max(200),
  quantity: z.number().int().positive(),
  discount_rate: z.number().min(0).max(100),
  price: z.number().positive(),
  tax_rate: z.string().regex(decimalRegex),
  unit_measure_id: z.number().int().positive(),
  standard_code_id: z.number().int().positive(),
  is_excluded: z.union([z.literal(0), z.literal(1)]),
  tribute_id: z.number().int().positive(),
  withholding_taxes: z.array(WithholdingTaxSchema).optional(),
});

// Esquema principal
export const InvoiceSchema = z
  .object({
    document: z.union([z.literal("01"), z.literal("03")]).default("01"),
    numbering_range_id: z.number().int().positive(),
    reference_code: z.string().min(1).max(20),
    observation: z.string().max(250).optional().default(""),
    payment_form: z.union([z.literal("1"), z.literal("2")]).default("1"),
    payment_due_date: z.string().regex(dateRegex).optional(),
    payment_method_code: z.string().default("10"),
    billing_period: BillingPeriodSchema,
    customer: CustomerSchema,
    items: z.array(ItemSchema).min(1),
    related_documents: z
      .array(
        z.object({
          code: z.string().min(1),
          issue_date: z.string().regex(dateRegex),
          number: z.string().min(1),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validación condicional para fecha de vencimiento
    if (data.payment_form === "2" && !data.payment_due_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'payment_due_date es requerido cuando payment_form es "2"',
        path: ["payment_due_date"],
      });
    }

    // Validación para documentos relacionados
    if (data.document === "03" && !data.related_documents?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'related_documents es requerido cuando document es "03"',
        path: ["related_documents"],
      });
    }
  });

// Tipo TypeScript generado
export type Invoice = z.infer<typeof InvoiceSchema>;
