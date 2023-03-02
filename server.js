const express = require("express");
const path = require("path");
const service = require("./api/service")
const push = require("./api/push")
const app = express();
app.use(express.static(__dirname + "/dist/pwa"));
app.use("/service", service);
app.use("/push", push);
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/pwa/index.html"));
});
app.listen(process.env.PORT || 8080);
