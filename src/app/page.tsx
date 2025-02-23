import { FormWrapper } from "@/components/invoice/forms/FormProvider";
import InvoiceForm from "@/components/invoice/forms/InvoiceForm";

export default function Home() {
  return (
    <main>
      <section>
        <FormWrapper>
          <InvoiceForm />
        </FormWrapper>
      </section>
    </main>
  );
}
