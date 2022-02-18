const Router = require("express");
const authRouter = require("./auth");
const indexRouter = new Router();

indexRouter.use("/auth", authRouter);

module.exports = indexRouter;
