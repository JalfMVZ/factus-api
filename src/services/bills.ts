import { BillFilters } from "./interfaces/bills-interface";

export const getAllBills = async (
  token: string,
  filters?: BillFilters,
  page?: number
) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(`filter[${key}]`, value);
        }
      });
    }

    if (page) {
      queryParams.append("page", page.toString());
    }

    const url = `${
      process.env.NEXT_PUBLIC_URL_API
    }/v1/bills?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error_description || "Error al obtener facturas"
      );
    }

    const responseData = await response.json();

    if (!responseData.data || !Array.isArray(responseData.data.data)) {
      throw new Error("Formato de respuesta inválido");
    }

    return {
      bills: responseData.data.data,
      pagination: responseData.data.pagination,
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    throw new Error(error.message || "Error de conexión");
  }
};
