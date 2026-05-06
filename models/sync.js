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