import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Expense extends Model {}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },    
  },
  {
    sequelize, // necesario para conectarse a la bd
    modelName: 'Expense', // nombre del modelo
    tableName: 'expenses', // nombre de la tabla
    createdAt: true, // cada vez que crea un usuario coloca la fecha de creacion
    deletedAt: true, // cada vez que se elimina un usuario coloca la fecha de eliminacion
    updatedAt: true, // cada vez que edita un usuario coloca la fecha de edicion
  },
);

// gastos
//  id
// "monto": 45.50,
// "titulo": "Almuerzo",
// "categoriaId": 2
// "usuarioId": 
// -- auditoria
// createdAt
// deletedAt => null | Date
// updatedAt