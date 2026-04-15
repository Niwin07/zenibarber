import { Router } from "express";
// Acá está la magia: importamos exactamente los nombres que tenés en el controlador
import {
  listarTurnos,
  crearTurno,
  cambiarEstado,
  cerrarTurno,
} from "../controllers/turno.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authorize);

router.get("/", listarTurnos);
router.post("/", crearTurno);
router.patch("/:id/estado", cambiarEstado);
router.post("/:id/cerrar", cerrarTurno);

export default router;
