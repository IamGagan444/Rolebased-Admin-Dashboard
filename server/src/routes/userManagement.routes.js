import { Router } from "express";

import {

  createUser,
  getAllUsers,
  getCreatedUsers,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-user").post(authMiddleware(["superAdmin","admin","superUser"]),upload.none(), createUser);
router.route("/get-all-users").get(authMiddleware(["superAdmin","admin","superUser"]),getAllUsers);
// router.route("/get-create-users").get(authMiddleware("admin"),getCreatedUsers);


export default router;
