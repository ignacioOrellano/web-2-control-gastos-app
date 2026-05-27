import {
  tagValidation,
} from "../helpers/validations.js";
import { User } from "../models/User.js";
import { Tag } from "../models/Tag.js";

function getAuthenticatedUserId(req) {
  const userId = Number(req.user?.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }
  return userId;
}

function renderAuthRequired(res) {
  res.status(401).render('tag/error', {
    code: 401,
    msg: 'Usuario no autenticado',
    alert: {
      status: 'error',
      text: 'Debes iniciar sesion para operar categorias.',
    },
  });
}

function buildValidationMessage(validacion) {
  const titleError = validacion.errors.title;
  const colorError = validacion.errors.color;

  let msg = '';
  if (titleError) {
    for (const e of titleError) {
      msg += ` ${e}`;
    }
  }
  if (colorError) {
    for (const e of colorError) {
      msg += ` ${e}`;
    }
  }

  return msg.trim() || 'Datos de categoria invalidos.';
}

async function getCurrentUser(userId) {
  return User.findByPk(userId, {
    attributes: ['id', 'firstName', 'lastName'],
  });
}

async function getUserTags(userId) {
  return Tag.findAll({
    where: { userId: userId },
    attributes: ['id', 'title', 'color', 'createdAt'],
    order: [['title', 'asc']],
  });
}

async function getOwnedTag(tagId, userId) {
  return Tag.findOne({
    where: {
      id: tagId,
      userId: userId,
    },
    attributes: ['id', 'title', 'color', 'createdAt', 'updatedAt'],
  });
}

export async function getTags(req, res, options = {}) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  try {
    const [usuario, categorias] = await Promise.all([
      getCurrentUser(userId),
      getUserTags(userId),
    ]);

    if (!usuario) {
      res.status(404).render('tag/error', {
        code: 404,
        msg: 'Usuario no encontrado',
      });
      return;
    }

    res.render('tag/index', {
      categorias,
      user: {
        id: usuario.id,
        nombre: usuario.firstName,
      },
      alert: options.alert,
    });
  } catch (error) {
    console.error('Error al listar categorias:', error);
    res.status(500).render('tag/error', {
      code: 500,
      msg: 'Error al cargar las categorias.',
      alert: {
        status: 'error',
        text: 'No se pudieron cargar las categorias.',
      },
    });
  }
}

export async function getNewTag(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  try {
    res.render('tag/nuevo', {
      values: {
        title: '',
        color: '#6b7280',
      },
    });
  } catch (error) {
    console.error('Error al cargar formulario de nueva categoria:', error);
    res.status(500).render('tag/error', {
      code: 500,
      msg: 'No se pudo cargar el formulario de nueva categoria.',
    });
  }
}

export async function postNewTag(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  const body = req.body;
  const { title, color } = body;

  const validacion = tagValidation({
    title,
    color,
  });

  try {
    if (validacion.success === false) {
      res.status(400).render('tag/nuevo', {
        values: body,
        alert: {
          status: 'error',
          text: buildValidationMessage(validacion),
        },
      });
      return;
    }

    const nuevaCategoria = {
      title: title,
      color: color,
      userId: userId,
    };

    await saveOneTag(nuevaCategoria);

    await getTags(req, res, {
      alert: {
        status: 'success',
        text: 'Categoria creada exitosamente!',
      },
    });
  } catch (error) {
    console.error('Error al crear categoria:', error);
    res.status(500).render('tag/error', {
      code: 500,
      msg: 'No se pudo crear la categoria.',
      alert: {
        status: 'error',
        text: 'No se pudo crear la categoria!',
      },
    });
  }
}

export async function getEditTag(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  const tagId = Number(req.params.id);
  if (!Number.isInteger(tagId) || tagId <= 0) {
    res.status(400).render('tag/error', {
      code: 400,
      msg: 'Id de categoria invalido.',
    });
    return;
  }

  try {
    const categoria = await getOwnedTag(tagId, userId);

    if (!categoria) {
      res.status(404).render('tag/error', {
        code: 404,
        msg: 'Categoria no encontrada.',
      });
      return;
    }

    res.render('tag/editar', {
      categoria,
      values: {
        title: categoria.title,
        color: categoria.color,
      },
    });
  } catch (error) {
    console.error('Error al cargar formulario de edicion de categoria:', error);
    res.status(500).render('tag/error', {
      code: 500,
      msg: 'No se pudo cargar el formulario de edicion.',
    });
  }
}

export async function postEditTag(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  const tagId = Number(req.params.id);
  if (!Number.isInteger(tagId) || tagId <= 0) {
    res.status(400).render('tag/error', {
      code: 400,
      msg: 'Id de categoria invalido.',
    });
    return;
  }

  const body = req.body;
  const { title, color } = body;

  const validacion = tagValidation({
    title,
    color,
  });

  try {
    const categoria = await getOwnedTag(tagId, userId);

    if (!categoria) {
      res.status(404).render('tag/error', {
        code: 404,
        msg: 'Categoria no encontrada.',
      });
      return;
    }

    if (validacion.success === false) {
      res.status(400).render('tag/editar', {
        categoria,
        values: body,
        alert: {
          status: 'error',
          text: buildValidationMessage(validacion),
        },
      });
      return;
    }

    categoria.title = title;
    categoria.color = color;
    await categoria.save();

    await getTags(req, res, {
      alert: {
        status: 'success',
        text: 'Categoria editada exitosamente!',
      },
    });
  } catch (error) {
    console.error('Error al editar categoria:', error);
    res.status(500).render('tag/error', {
      code: 500,
      msg: 'No se pudo editar la categoria.',
      alert: {
        status: 'error',
        text: 'No se pudo editar la categoria!',
      },
    });
  }
}

export async function postDeleteTag(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    renderAuthRequired(res);
    return;
  }

  const tagId = Number(req.params.id);
  if (!Number.isInteger(tagId) || tagId <= 0) {
    res.status(400).render('tag/error', {
      code: 400,
      msg: 'Id de categoria invalido.',
    });
    return;
  }

  try {
    const categoria = await getOwnedTag(tagId, userId);

    if (!categoria) {
      res.status(404).render('tag/error', {
        code: 404,
        msg: 'Categoria no encontrada.',
      });
      return;
    }

    await categoria.destroy();

    await getTags(req, res, {
      alert: {
        status: 'success',
        text: 'Categoria eliminada exitosamente!',
      },
    });
  } catch (error) {
    console.error('Error al eliminar categoria:', error);
    res.status(500).render('tag/error', {
      code: 500,
      msg: 'No se pudo eliminar la categoria.',
      alert: {
        status: 'error',
        text: 'No se pudo eliminar la categoria!',
      },
    });
  }
}

async function saveOneTag(tag) {
  await Tag.create(tag);
}
