export const getAllMeasurementUnits = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/v1/measurement-units`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(
        errorData.error_description || "Error al obtener las unidades de medida"
      );
    }

    const data = await response.json();

    if (!Array.isArray(data.data)) {
      throw new Error("Invalid API response format: expected an array");
    }

    return data.data;
  } catch (error: any) {
    console.error("Catch error:", error.message);
    throw new Error(error.message || "Error de conexión");
  }
};
