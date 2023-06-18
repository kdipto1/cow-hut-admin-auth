import express from "express";
import { CowController } from "./cow.controller";

const router = express.Router();

router.post("/", CowController.createCow);

export const CowRoutes = router;
