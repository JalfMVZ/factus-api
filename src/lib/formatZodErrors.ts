import { Invoice } from "@/components/invoice/schema/invoice.schema";
import { FieldErrors } from "react-hook-form";

export const formatZodErrors = (errors: FieldErrors<Invoice>) => {
  return Object.entries(errors).reduce(
    (acc: Record<string, string[]>, [key, error]) => {
      if (error && typeof error === "object" && "message" in error) {
        acc[key] = [error.message as string];
      }
      return acc;
    },
    {}
  );
};
