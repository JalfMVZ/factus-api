import {
  Invoice,
  InvoiceSchema,
} from "@/components/invoice/schema/invoice.schema";
import { ApiResponse, ApiError } from "@/services/interfaces/apiResponse";
import { BillValidationError } from "@/errors/billCreationError";
import { z } from "zod";

// const debug = (stage: string, data: any) => {
//   console.group(`🔍 Debug: ${stage}`);
//   console.log(JSON.stringify(data, null, 2));
//   console.groupEnd();
// };

const transformApiErrors = (errors: ApiError[]): Record<string, string[]> => {
  const transformed = errors.reduce((acc, error) => {
    const path =
      error.source?.pointer?.replace("/data/", "").replaceAll("/", ".") ||
      "general";
    acc[path] = [error.detail];
    return acc;
  }, {} as Record<string, string[]>);
  return transformed;
};

export const processInvoice = async (
  formData: Invoice,
  token: string
): Promise<ApiResponse<Invoice>> => {
  try {
    const validatedData = InvoiceSchema.parse(formData);

    const payload = {
      ...validatedData,
      items: validatedData.items.map((item) => ({
        ...item,
        tax_rate: parseFloat(item.tax_rate),
        withholding_taxes: item.withholding_taxes?.map((tax) => ({
          ...tax,
          withholding_tax_rate: parseFloat(tax.withholding_tax_rate),
        })),
      })),
    };

    const API_ENDPOINT = `${process.env.NEXT_PUBLIC_URL_API}/v1/bills/validate`;

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let responseData: ApiResponse<Invoice>;
    try {
      responseData = await response.json();
    } catch (e) {
      const textResponse = await response.text();
      throw new Error("Respuesta no válida del servidor");
    }

    if (!response.ok) {
      throw new BillValidationError(
        responseData.errors
          ? transformApiErrors(responseData.errors)
          : { general: [responseData.message || "Error desconocido"] }
      );
    }

    return responseData;
  } catch (error: unknown) {
    const errorData = {
      type: error instanceof Error ? error.constructor.name : "Unknown",
      message: error instanceof Error ? error.message : "Error desconocido",
      stack: error instanceof Error ? error.stack : undefined,
    };

    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path.join(".")] = [curr.message];
        return acc;
      }, {} as Record<string, string[]>);
      throw new BillValidationError(formattedErrors);
    }

    if (error instanceof BillValidationError) {
      throw error;
    }

    throw new BillValidationError({
      general: ["Ocurrió un error inesperado. Por favor intente nuevamente."],
    });
  }
};
