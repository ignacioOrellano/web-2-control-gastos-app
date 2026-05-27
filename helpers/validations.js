import * as z from "zod";

// ESQUEMA DE VALIDACION DE GASTO
const ExpenseSchema = z.object({ 
  // id: z.number("Id debe ser un numero!"),
  // userId: z.number("userId debe ser un numero!"),
  monto: z.number("El monto debe ser un numero!")
    .gt(0, "EL monto debe ser mayor a cero!"),
  titulo: z.string("Titulo debe ser un texto!")
    .max(50, "El titulo debe tener como máximo 50 caracteres")
    .min(5, "El titulo debe tener como mínimo 5 caracteres"),
  descripcion: z.string("Descripcion debe ser un texto!").optional(),
  // categoriaId: z.number()
});

const TagSchema = z.object({
  title: z.string("El titulo debe ser un texto!")
    .min(3, "El titulo debe tener como minimo 3 caracteres")
    .max(50, "El titulo debe tener como maximo 50 caracteres"),
  color: z.string("El color debe ser un texto!")
    .regex(/^#[0-9a-fA-F]{6}$/, "El color debe tener formato hexadecimal (#RRGGBB)"),
});

// FUNCIONES DE VALIDACION - exportadas para ser usadas en rutas, controladores, etc
export function expenseValidation(gasto){
  const resultado = ExpenseSchema.safeParse(gasto);
  if(resultado.success === false){
    return {
      success: false,
      errors: z.flattenError(resultado.error).fieldErrors
    }
  }
  
  return {
    success: true
  }
}

export function tagValidation(tag) {
  const resultado = TagSchema.safeParse(tag);
  if (resultado.success === false) {
    return {
      success: false,
      errors: z.flattenError(resultado.error).fieldErrors,
    };
  }

  return {
    success: true,
  };
}