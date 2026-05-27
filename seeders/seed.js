import sequelize from '../models/config.js'
import { initializeAssociations } from '../models/index.js'
import { User } from '../models/User.js'
import { Tag } from '../models/Tag.js'
import { Expense } from '../models/Expense.js'

async function seed() {
  initializeAssociations();
  await sequelize.sync({ alter: true, force: true });

  const users = await User.bulkCreate([
    {
      firstName: "Jack",
      lastName: "Sparrow",
      email: "jacksparrow@gmail.com",
    },
    {
      firstName: "Capitan",
      lastName: "America",
      email: "capitanamerica@gmail.com",
      phone: "+542665123123"
    }
  ])

  const tags = await Tag.bulkCreate([
    //Jack Sparrow
    { color: "red", title: "Monedas de oro", userId: users[0].id },
    { color: "blue", title: "Alcohol", userId: users[0].id },
    { color: "green", title: "Comida", userId: users[0].id },
    //Capitan America
    { color: "red", title: "Limpieza", userId: users[1].id },
    { color: "blue", title: "Supermercado", userId: users[1].id },
  ])

  const expenses = await Expense.bulkCreate([
    //Jack Sparrow
    { amount: 150.00, title: "Monedas de oro del cofre", userId: users[0].id, tagId: tags[0].id },
    { amount: 45.50, title: "Ron del Caribe", userId: users[0].id, tagId: tags[1].id },
    { amount: 30.00, title: "Cena en puerto", userId: users[0].id, tagId: tags[2].id },
    { amount: 200.75, title: "Tesoro saqueado", userId: users[0].id, tagId: tags[0].id },
    { amount: 18.25, title: "Almuerzo en la taberna", userId: users[0].id, tagId: tags[2].id },
    //Capitan America
    { amount: 55.00, title: "Detergente y esponja", userId: users[1].id, tagId: tags[3].id },
    { amount: 120.50, title: "Compras semanales", userId: users[1].id, tagId: tags[4].id },
    { amount: 35.75, title: "Lavandina y trapos", userId: users[1].id, tagId: tags[3].id },
    { amount: 210.00, title: "Supermercado mensual", userId: users[1].id, tagId: tags[4].id },
    { amount: 18.90, title: "Jabón y shampoo", userId: users[1].id, tagId: tags[3].id },
    { amount: 75.25, title: "Frutas y verduras", userId: users[1].id, tagId: tags[4].id },
    { amount: 42.00, title: "Productos de limpieza hogar", userId: users[1].id, tagId: tags[3].id },
    { amount: 98.60, title: "Carnes y lácteos", userId: users[1].id, tagId: tags[4].id },
    { amount: 27.30, title: "Desinfectante multiusos", userId: users[1].id, tagId: tags[3].id },
    { amount: 155.00, title: "Despensa quincenal", userId: users[1].id, tagId: tags[4].id },
  ])

  sequelize.close();
}

seed();