const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");

const links = [];

app.get("/", (req, response) => {
  response.render("main-page", {
    doctitle: "Main Page for Pokemon Stuff",
    links: [{ href: "/another", linkText: "Another Page" }],
  });
});

app.get("/another", (req, res) => {
  res.render("another-page", {
    doctitle: "Another Page",
    links: [{ href: "/", linkText: "Home" }],
  });
});

app.get("/whatever-page", (req, res) => {
  res.render("third-page", {
    doctitle: "Third Page",
    links: [
      { href: "/another", linkText: "Another Page" },
      { href: "/", linkText: "Home" },
    ],
  });
});

app.listen(3000, () => {
  console.log("Listening on 3000");
});
