require("dotenv").config();

require("./db");

const express = require("express");


const hbs = require("hbs");

const app = express();

require("./config")(app);
require('./config/session.config')(app)


const capitalize = require("./utils/capitalize");
const projectName = "Proyecto-test-auth";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);

require("./error-handling")(app);

module.exports = app;
