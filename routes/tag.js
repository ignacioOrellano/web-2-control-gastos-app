import { Router } from "express";
import {
  getTags,
  getNewTag,
  postNewTag,
  getEditTag,
  postEditTag,
  postDeleteTag,
} from '../controller/tag.js';

// /tag
const router = Router();

// /tag/
router.get('/', getTags);

// /tag/nuevo
router.get('/nuevo', getNewTag);
router.post('/nuevo', postNewTag);

// /tag/editar/:id
router.get('/editar/:id', getEditTag);
router.post('/editar/:id', postEditTag);

// /tag/eliminar/:id
router.post('/eliminar/:id', postDeleteTag);

export default router;
