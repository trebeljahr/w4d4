const express = require("express");
const hbs = require("hbs");

const app = express();

const PORT = 3000;

hbs.registerHelper("upper", (val) => {
  return val.toUpperCase();
});

hbs.registerHelper("plusOne", (number) => {
  return number + 1;
});

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("example", {
    name: "Rafa",
    anotherName: "Joana",
    city: "Berlin",
    city2: "Amsterdam",
    displayCity: true,
    displayCity2: true,
    movie: {
      name: "Harry Potter",
      numberOfParts: 7,
      protagonist: "Harry",
    },
    todos: ["do ironhack bootcamp", "write really good app", "retire"],
    people: ["Julie", "Rahaf", "Joana", "Rico"],
    cities: ["Paris", "Berlin", "Berlin", "Berlin"],
    favoriteMovies: ["Goodfellas", "Harry Potter", "Look Up", "Kill Bill"],
    htmlCode:
      '<script>prompt("Sry we forgot your password, could you remind us")</script>',
  });
});

app.listen(PORT, () => {
  console.log("I am listening on ", PORT);
});
