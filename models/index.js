import sequelize from "./config.js";
import { Expense } from "./Expense.js";
import { Tag } from "./Tag.js";
import { User } from "./Usuario.js";

// usuario y categoria (1:n)
User.hasMany(Tag)
Tag.belongsTo(User)
// usuario y gasto (1:n)
User.hasMany(Expense)
Expense.belongsTo(User)
// categoria y gasto (1:n)
Tag.hasMany(Expense)
Expense.belongsTo(Tag)

export async function connectDatabase() {
  try {
    await sequelize.authenticate(); // testear la conexion
    console.log('[+] Conexion a bd establecida')

    await sequelize.sync({ alter: true });
    console.log('[+] Sincronizado de modelos')
  } catch (error) {
    console.error('[+] Error en la conexion a la bd', error)
    throw error
  }
}