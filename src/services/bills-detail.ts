export const getBillDetail = async (token: string, number: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/v1/bills/show/${number}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error obteniendo detalle de factura"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en getBillDetail:", error.message);
    throw error;
  }
};
