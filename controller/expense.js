import {
  expenseValidation,
} from "../helpers/validations.js";
import { User } from "../models/User.js";
import { Expense } from "../models/Expense.js";
import { Tag } from "../models/Tag.js";

function getAuthenticatedUserId(req) {
  const userId = Number(req.user?.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }
  return userId;
}

function renderAuthRequired(res) {
  res.status(401).render('expense/error', {
    code: 401,
    msg: 'Usuario no autenticado',
    alert: {
      status: 'error',
      text: 'Debes iniciar sesion para operar gastos.',
    },
  });
}

function buildValidationMessage(validacion) {
  const montoError = validacion.errors.monto;
  const tituloError = validacion.errors.titulo;

  let msg = '';
  if (montoError) {
    for (const e of montoError) {
      msg += ` ${e}`;
    }
  }
  if (tituloError) {
    for (const e of tituloError) {
      msg += ` ${e}`;
    }
  }

  return msg.trim() || 'Datos del gasto invalidos.';
}

async function getCurrentUser(userId) {
  return User.findByPk(userId, {
    attributes: ['id', 'firstName', 'lastName'],
  });
}

async function getUserTags(userId) {
  return Tag.findAll({
    where: { userId: userId },
    attributes: ['id', 'title', 'color'],
    order: [['title', 'asc']],
  });
}

async function getOwnedExpense(expenseId, userId) {
  return Expense.findOne({
    where: {
      id: expenseId,
      userId: userId,
    },
    include: [{
      model: Tag,
      attributes: ['id', 'title', 'color'],
    }],
  });
}

export async function getExpenses(req, res, options = {}) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  try {
    const usuario = await getCurrentUser(userId);
    if (!usuario) {
      res.status(404).render('expense/error', {
        code: 404,
        msg: 'Usuario no encontrado',
      });
      return;
    }

    const expenses = await Expense.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: Tag,
          attributes: ['id', 'title', 'color'],
        },
      ],
    });

    res.render('expense/index', {
      gastos: expenses,
      user: {
        id: usuario.id,
        nombre: usuario.firstName,
      },
    });
  } catch (error) {
    console.error('Error al listar gastos:', error);
    res.status(500).render('expense/error', {
      code: 500,
      msg: 'Error al cargar los gastos',
    });
  }
}

export async function getNewExpense(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  try {
    const categorias = await getUserTags(userId);
    res.render('expense/nuevo', {
      categorias,
      values: {
        monto: '',
        titulo: '',
        descripcion: '',
        categoriaId: '',
      },
    });
  } catch (error) {
    console.error('Error al cargar formulario de nuevo gasto:', error);
    res.status(500).render('expense/error', {
      code: 500,
      msg: 'No se pudo cargar el formulario de nuevo gasto.',
    });
  }
}

export async function postNewExpense(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  const body = req.body;
  const { titulo, descripcion, categoriaId } = body;
  const monto = Number(body.monto);
  const tagId = Number(categoriaId);

  const validacion = expenseValidation({
    monto,
    titulo,
    descripcion,
  });

  try {
    const categorias = await getUserTags(userId);

    if (validacion.success === false) {
      res.status(400).render('expense/nuevo', {
        categorias,
        values: body,
        alert: {
          status: 'error',
          text: buildValidationMessage(validacion),
        },
      });
      return;
    }

    if (!Number.isInteger(tagId) || tagId <= 0) {
      res.status(400).render('expense/nuevo', {
        categorias,
        values: body,
        alert: {
          status: 'error',
          text: 'Debes seleccionar una categoria valida.',
        },
      });
      return;
    }

    const categoria = await Tag.findOne({
      where: {
        id: tagId,
        userId: userId,
      },
    });

    if (!categoria) {
      res.status(404).render('expense/error', {
        code: 404,
        msg: 'Categoria no encontrada para el usuario autenticado.',
      });
      return;
    }

    const nuevoGasto = {
      amount: monto,
      title: titulo,
      description: descripcion ? descripcion : '',
      tagId: tagId,
      userId: userId,
    };

    await saveOneGasto(nuevoGasto);

    await getExpenses(req, res, {
      alert: {
        status: 'success',
        text: 'Gasto creado exitosamente!',
      },
    });
  } catch (error) {
    console.error('Error al crear gasto:', error);
    res.status(500).render('expense/error', {
      code: 500,
      msg: 'No se pudo crear el gasto.',
      alert: {
        status: 'error',
        text: 'No se pudo crear el gasto!',
      },
    });
  }
}

export async function getEditExpense(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  const expenseId = Number(req.params.id);
  if (!Number.isInteger(expenseId) || expenseId <= 0) {
    res.status(400).render('expense/error', {
      code: 400,
      msg: 'Id de gasto invalido.',
    });
    return;
  }

  try {
    const [gasto, categorias] = await Promise.all([
      getOwnedExpense(expenseId, userId),
      getUserTags(userId),
    ]);

    if (!gasto) {
      res.status(404).render('expense/error', {
        code: 404,
        msg: 'Gasto no encontrado.',
      });
      return;
    }

    res.render('expense/editar', {
      gasto,
      categorias,
      values: {
        monto: gasto.amount,
        titulo: gasto.title,
        descripcion: gasto.description || '',
        categoriaId: gasto.tagId,
      },
    });
  } catch (error) {
    console.error('Error al cargar formulario de edicion:', error);
    res.status(500).render('expense/error', {
      code: 500,
      msg: 'No se pudo cargar el formulario de edicion.',
    });
  }
}

export async function postEditExpense(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  const expenseId = Number(req.params.id);
  if (!Number.isInteger(expenseId) || expenseId <= 0) {
    res.status(400).render('expense/error', {
      code: 400,
      msg: 'Id de gasto invalido.',
    });
    return;
  }

  const body = req.body;
  const { titulo, descripcion, categoriaId } = body;
  const monto = Number(body.monto);
  const tagId = Number(categoriaId);

  const validacion = expenseValidation({
    monto,
    titulo,
    descripcion,
  });

  try {
    const [gasto, categorias] = await Promise.all([
      getOwnedExpense(expenseId, userId),
      getUserTags(userId),
    ]);

    if (!gasto) {
      res.status(404).render('expense/error', {
        code: 404,
        msg: 'Gasto no encontrado.',
      });
      return;
    }

    if (validacion.success === false) {
      res.status(400).render('expense/editar', {
        gasto,
        categorias,
        values: body,
        alert: {
          status: 'error',
          text: buildValidationMessage(validacion),
        },
      });
      return;
    }

    if (!Number.isInteger(tagId) || tagId <= 0) {
      res.status(400).render('expense/editar', {
        gasto,
        categorias,
        values: body,
        alert: {
          status: 'error',
          text: 'Debes seleccionar una categoria valida.',
        },
      });
      return;
    }

    const categoria = await Tag.findOne({
      where: {
        id: tagId,
        userId: userId,
      },
    });

    if (!categoria) {
      res.status(404).render('expense/error', {
        code: 404,
        msg: 'Categoria no encontrada para el usuario autenticado.',
      });
      return;
    }

    gasto.amount = monto;
    gasto.title = titulo;
    gasto.description = descripcion ? descripcion : '';
    gasto.tagId = tagId;
    await gasto.save();

    await getExpenses(req, res, {
      alert: {
        status: 'success',
        text: 'Gasto editado exitosamente!',
      },
    });
  } catch (error) {
    console.error('Error al editar gasto:', error);
    res.status(500).render('expense/error', {
      code: 500,
      msg: 'No se pudo editar el gasto.',
      alert: {
        status: 'error',
        text: 'No se pudo editar el gasto!',
      },
    });
  }
}

export async function postDeleteExpense(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  const expenseId = Number(req.params.id);
  if (!Number.isInteger(expenseId) || expenseId <= 0) {
    res.status(400).render('expense/error', {
      code: 400,
      msg: 'Id de gasto invalido.',
    });
    return;
  }

  try {
    const gasto = await getOwnedExpense(expenseId, userId);
    if (!gasto) {
      res.status(404).render('expense/error', {
        code: 404,
        msg: 'Gasto no encontrado.',
      });
      return;
    }

    await gasto.destroy();

    await getExpenses(req, res, {
      alert: {
        status: 'success',
        text: 'Gasto eliminado exitosamente!',
      },
    });
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    res.status(500).render('expense/error', {
      code: 500,
      msg: 'No se pudo eliminar el gasto.',
      alert: {
        status: 'error',
        text: 'No se pudo eliminar el gasto!',
      },
    });
  }
}

async function saveOneGasto(gasto) {
  await Expense.create(gasto);
}