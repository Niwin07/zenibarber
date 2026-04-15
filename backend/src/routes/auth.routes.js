import { Router } from "express";
import { login, refresh, logout, me } from "../controllers/auth.controller.js";
// Asumo que tu middleware de auth se exporta así. Si se llama distinto, ajustalo:
import { authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authorize, me);

export default router;
