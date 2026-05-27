import sequelize from "./config.js";
import { Expense } from "./Expense.js";
import { Tag } from "./Tag.js";
import { User } from "./User.js";

let associationsInitialized = false;

export function initializeAssociations() {
  if (associationsInitialized) {
    return;
  }

  // usuario y categoria (1:n)
  User.hasMany(Tag, { foreignKey: 'userId' });
  Tag.belongsTo(User, { foreignKey: 'userId' });
  // usuario y gasto (1:n)
  User.hasMany(Expense, { foreignKey: 'userId' });
  Expense.belongsTo(User, { foreignKey: 'userId' });
  // categoria y gasto (1:n)
  Tag.hasMany(Expense, { foreignKey: 'tagId' });
  Expense.belongsTo(Tag, { foreignKey: 'tagId' });

  associationsInitialized = true;
}

export async function connectDatabase() {
  try {
    initializeAssociations();
    await sequelize.authenticate(); // testear la conexion
    console.log('[+] Conexion a bd establecida')
    
    await sequelize.sync({ alter: true });
    console.log('[+] Sincronizado de modelos')
  } catch (error) {
    console.error('[+] Error en la conexion a la bd', error)
    throw error
  }
}