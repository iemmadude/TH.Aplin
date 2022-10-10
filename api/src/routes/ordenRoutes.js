import { Router } from "express";
import { addOrden, getOrden, deleteOrden, updateOrden } from "../controllers/ordenControllers.js";

const router = Router()

router.post("/orden", addOrden)
router.get("/orden", getOrden)
router.delete("/orden/:id", deleteOrden)
router.put("/orden/:id", updateOrden)

export default router