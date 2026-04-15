import { Router } from "express";
import {
  listarUsuarios,
  crearUsuario,
} from "../controllers/usuario.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = Router();

// Protegemos con el token
router.use(authorize);

router.get("/", listarUsuarios);
router.post("/", crearUsuario);

export default router;
