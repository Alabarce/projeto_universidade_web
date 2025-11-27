const express = require("express");
const path = require("path");
const routes = require("../routes/projeto_universidade_routes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = app;
  