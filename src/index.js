import path from "path";
import express from "express";
import hbs from "hbs";
import { engine } from "express-handlebars";

const __dirname = path.resolve();
const PORT = 3000;
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res) => {
  res.render("pages/home-page", {
    title: "Eshop22",
  });
});

app.get("/goods", (req, res) => {
  res.render("pages/goods-detailed-page", {
    title: "Goods",
  });
});

app.use(function (req, res, next) {
  res.statusCode = 404;
  res.render("pages/not-found-page", {
    title: "Sorry, page not found",
    url: req.url,
  });
});

app.listen(PORT, () => {
  console.log("created server, port:", PORT);
});
