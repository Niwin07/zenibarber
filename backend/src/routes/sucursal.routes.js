import { Router } from "express";
import {
  listarSucursales,
  crearSucursal,
} from "../controllers/sucursal.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = Router();

// Protegemos todas las rutas con el middleware de autenticación
router.use(authorize);

router.get("/", listarSucursales);
router.post("/", crearSucursal);

export default router;
