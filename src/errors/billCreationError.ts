export class BillValidationError extends Error {
  constructor(public readonly errors: Record<string, string[]>) {
    super("Error de validación en la factura");
    this.name = "BillValidationError";
  }
}

export class BillCreationError extends Error {
  constructor(public errors: any) {
    super("Error al crear la factura");
    this.name = "BillCreationError";
  }
}
