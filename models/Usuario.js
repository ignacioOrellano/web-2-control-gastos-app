import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING, //255
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    address: {
      type: DataTypes.TEXT,
    },
    avatar: {
      type: DataTypes.BLOB,
    }
  },
  {
    sequelize, // necesario para conectarse a la bd
    modelName: 'User', // nombre del modelo
    tableName: 'users', // nombre de la tabla
    createdAt: true, // cada vez que crea un usuario coloca la fecha de creacion
    deletedAt: true, // cada vez que se elimina un usuario coloca la fecha de eliminacion
  },
);

// user 
// id not null autoincremental
// firstname not null varchar(50)
// lastname not null varchar(50)
// birthDate Date
// email not null varchar
// phone varchar
// -- auditoria
// createdAt
// deletedAt => null | Date