"use client";
import { FormWrapperProps } from "@/interfaces/formWrapper";
import { useForm, FormProvider } from "react-hook-form";


export const FormWrapper = ({ children }: FormWrapperProps) => {
  const methods = useForm();

  return <FormProvider {...methods}>{children}</FormProvider>;
};
