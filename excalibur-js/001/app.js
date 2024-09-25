var http = require("http");
var express = require("express");
var app = express();
app.set("port", process.env.PORT || 4000);

var server = http.createServer(app);

server.listen(app.get("port"), () => {
  console.log("Servidor escuchando en el puerto " + app.get("port"));
});

var path = require("path");
var publicPath = path.resolve(__dirname, "dist");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});
