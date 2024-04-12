import express from "express";
import authControllers from "../controllers/authControllers.js";
import { userSignupSchem, userSigninSchem, userEmailSchem } from "../schemas/userSchemas.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSignupSchem), authControllers.signup);
authRouter.get("/verify/:verificationToken", authControllers.verify);
authRouter.post("/verify", validateBody(userEmailSchem), authControllers.resendVerify);
authRouter.post("/login", validateBody(userSigninSchem), authControllers.signin);
authRouter.post("/logout", authenticate, authControllers.signout);
authRouter.delete("/:id", isValidId, authControllers.delUser);
authRouter.get("/:id", authenticate, isValidId, authControllers.findUser);
authRouter.put("/:id/played", authenticate, isValidId, authControllers.updatePlayed);
authRouter.put("/:id/selected", authenticate, isValidId, authControllers.updateSelected);

export default authRouter;