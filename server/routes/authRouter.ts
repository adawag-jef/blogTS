import express from "express";
import authCtrl from "../controllers/authCtrl";

const router = express.Router();

router.post("/register", authCtrl.register);

export default router;
