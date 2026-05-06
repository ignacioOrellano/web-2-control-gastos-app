import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Tag extends Model {}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },    
  },
  {
    sequelize, // necesario para conectarse a la bd
    modelName: 'Tag', // nombre del modelo
    tableName: 'tags', // nombre de la tabla
    createdAt: true, // cada vez que crea un usuario coloca la fecha de creacion
    deletedAt: true, // cada vez que se elimina un usuario coloca la fecha de eliminacion
    updatedAt: true, // cada vez que edita un usuario coloca la fecha de edicion
  },
);

// categoria
// id
// title
// color
// -- auditoria
// createdAt
// deletedAt => null | Date
// updatedAt