import {
  formSchema,
  InvoiceFormValues,
} from "@/components/invoice/schema/invoice.schema";
import { z } from "zod";

export class BillValidationError extends Error {
  constructor(public errors: any) {
    super("Error de validación de factura");
    this.name = "BillValidationError";
  }
}

export const validateBill = async (
  data: InvoiceFormValues,
  token: string
): Promise<any> => {
  try {
    // Primero validamos con Zod
    const validatedData = formSchema.parse(data);

    // Preparamos las fechas para la API
    const formattedData = {
      ...validatedData,
      payment_due_date: validatedData.payment_due_date
        .toISOString()
        .split("T")[0],
      billing_period: {
        ...validatedData.billing_period,
        start_date: validatedData.billing_period.start_date
          .toISOString()
          .split("T")[0],
        end_date: validatedData.billing_period.end_date
          .toISOString()
          .split("T")[0],
      },
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/v1/bills/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new BillValidationError(errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BillValidationError(error.errors);
    }

    if (error instanceof BillValidationError) {
      throw error;
    }

    console.error("Error validating bill:", error);
    throw new Error("Error al validar la factura");
  }
};
