import { Router } from "express";
import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
} from "../controllers/cliente.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authorize);

router.get("/", listarClientes);
router.get("/:id", obtenerCliente);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);

export default router;
