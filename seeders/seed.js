import sequelize from '../models/config.js'
import { User } from '../models/User.js'
import { Tag } from '../models/Tag.js'
import { Expense } from '../models/Expense.js'

async function seed() {
  await sequelize.sync({alter: true});

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
    { color: "red", title: "Monedas de oro", UserId: users[0].id },
    { color: "blue", title: "Alcohol", UserId: users[0].id },
    { color: "green", title: "Comida", UserId: users[0].id },
    //Capitan America
    { color: "red", title: "Limpieza", UserId: users[1].id },
    { color: "blue", title: "Supermercado", UserId: users[1].id },
  ])

  const expenses = await Expense.bulkCreate([
    //Jack Sparrow
    { amount: 150.00, title: "Monedas de oro del cofre", UserId: users[0].id, TagId: tags[0].id },
    { amount: 45.50, title: "Ron del Caribe", UserId: users[0].id, TagId: tags[1].id },
    { amount: 30.00, title: "Cena en puerto", UserId: users[0].id, TagId: tags[2].id },
    { amount: 200.75, title: "Tesoro saqueado", UserId: users[0].id, TagId: tags[0].id },
    { amount: 18.25, title: "Almuerzo en la taberna", UserId: users[0].id, TagId: tags[2].id },
    //Capitan America
    { amount: 55.00, title: "Detergente y esponja", UserId: users[1].id, TagId: tags[3].id },
    { amount: 120.50, title: "Compras semanales", UserId: users[1].id, TagId: tags[4].id },
    { amount: 35.75, title: "Lavandina y trapos", UserId: users[1].id, TagId: tags[3].id },
    { amount: 210.00, title: "Supermercado mensual", UserId: users[1].id, TagId: tags[4].id },
    { amount: 18.90, title: "Jabón y shampoo", UserId: users[1].id, TagId: tags[3].id },
    { amount: 75.25, title: "Frutas y verduras", UserId: users[1].id, TagId: tags[4].id },
    { amount: 42.00, title: "Productos de limpieza hogar", UserId: users[1].id, TagId: tags[3].id },
    { amount: 98.60, title: "Carnes y lácteos", UserId: users[1].id, TagId: tags[4].id },
    { amount: 27.30, title: "Desinfectante multiusos", UserId: users[1].id, TagId: tags[3].id },
    { amount: 155.00, title: "Despensa quincenal", UserId: users[1].id, TagId: tags[4].id },
  ])
}

seed();