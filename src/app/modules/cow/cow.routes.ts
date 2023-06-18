import express from "express";
import { CowController } from "./cow.controller";

const router = express.Router();

router.post("/", CowController.createCow);
router.get("/:id", CowController.getSingleCow);

export const CowRoutes = router;
