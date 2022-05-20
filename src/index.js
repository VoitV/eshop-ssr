import path from "path";
import express from "express";
import hbs from "hbs";
import { engine } from "express-handlebars";
import database from "./database.js";
import bodyParser from "body-parser";
const __dirname = path.resolve();
const PORT = 3000;
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const goods = await database.queryP(
    "SELECT g.*,c.ID AS c_id, c.categories_name as category, img.ID as goods_img_id, img.img_path as image FROM goods g LEFT JOIN categories c ON g.category_id = c.ID LEFT JOIN goods_img as img ON g.ID = img.goods_id"
  );

  let categories = [];

  for (let i = 0; i < goods.length; i++) {
    if (categories.includes(goods[i].category)) {
      continue;
    } else {
      categories.push(goods[i].category);
    }
  }

  let goodsList = [];

  for (let i = 0; i < categories.length; i++) {
    let tempArr = goods.filter((el) => el.category == categories[i]);
    goodsList.push(tempArr);
  }

  res.render("pages/home-page", {
    title: "Eshop22",
    goodsList,
  });
});

app.get("/goods/:category/:id", async (req, res) => {
  const params = req.params;
  params.id = params.id.replace(":", "");
  params.category = params.category.replace(":", "");
  const goods = await database.queryP(
    "SELECT * FROM goods LEFT JOIN categories ON goods.category_id = categories.ID WHERE goods.ID = ? && categories_name = ?",
    [params.id, params.category]
  );
  res.render("pages/goods-detailed-page", {
    goods: goods[0],
    title: goods[0].goods_name,
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
