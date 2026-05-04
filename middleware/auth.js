export function auth(req, res, next) {
  // TODO: pendiente para luego. lógica de autenticación

  // esta autenticado
  res.locals.currentPath = req.path;
  next();
}