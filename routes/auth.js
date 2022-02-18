const Router = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = new Router({ mergeParams: true });
const { check } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

authRouter.post(
    "/register",
    [
        check("username", "Username cannot be empty").notEmpty(),
        check("password", "Password cannot be shorter than 4 symbols").isLength(
            { min: 4 },
        ),
    ],
    authController.register,
);
authRouter.post("/login", authController.login);
authRouter.get("/", roleMiddleware(["USER"]), authController.getUser);

module.exports = authRouter;
