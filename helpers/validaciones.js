import * as z from "zod";

// ESQUEMA DE VALIDACION DE GASTO
const Gasto = z.object({ 
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

// FUNCIONES DE VALIDACION - exportadas para ser usadas en rutas, controladores, etc
export function validarGasto(gasto){
  const resultado = Gasto.safeParse(gasto);
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