import { User } from "../models/User.js";

export async function auth(req, res, next) {
  // TODO: pendiente para luego. lógica de autenticación
  req.user = {
    id: 2
  };
  const userId = Number(req.user?.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    next();
    return;
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName'],
    });

    if (user) {
      res.locals.currentUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }
  } catch (error) {
    console.error('[+] Error al cargar usuario para navbar:', error);
  }
  next();
}