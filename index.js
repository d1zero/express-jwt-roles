const express = require("express");
const mongoose = require("mongoose");
const { port } = require("./config");

const indexRouter = require("./routes");

const PORT = port || 8000;

const app = express();

app.use(express.json());
app.use("/api", indexRouter);

const start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/auth_roles");
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
