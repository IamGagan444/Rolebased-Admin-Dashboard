import express, { Router } from "express";
import { userLogin, userRegistration } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/user-registration").post(upload.none(),userRegistration)
router.route("/user-login").post(upload.none(),userLogin)

export default router;