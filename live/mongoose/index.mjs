// keep in mind - import only works in .mjs files
// the same is true for "top-level" await
import mongoose from "mongoose";

// hacky boilerplate
await mongoose.connect("mongodb://localhost:27017/live-pokemon");
// delete everything from the database and the database as well
// -> NEVER! do this in production code or you will loose all your data
await mongoose.connection.db.dropDatabase();
// close the connection to the now non-existent db
await mongoose.connection.close();

// connect to the db... again!
// mongodb -> protocol
// localhost -> host (could be some url for server - like www.google.com or an IP address like 198.0.0.3)
// 27017 -> port the db is running on
// live-pokemon -> db name to connect to -> if db of that name doesn't exist (because we deleted it before)
// mongoose will create a new, fresh one
await mongoose.connect("mongodb://localhost:27017/live-pokemon");

// write a setter function that capitalizes first letter of string
function capitalize(str) {
  return str[0].toUpperCase() + str.substring(1);
}

// creating a schema. like a template for the shape our data should have
const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    // make name required
    required: true,
    // make it unique, so no duplicates are allowed
    unique: true,
    // add validator to make sure that we have an exclamation mark at the end for the name
    validate: {
      validator: (name) => {
        // only if this returns true for the name we give the pokemon we don't throw an error
        return name[name.length - 1] === "!";
      },
      // the message we get from the validator when there is an error in the validation, i.e. when the
      // above function returned false
      message: "Names should end with exclamation mark",
    },
    // use setter function for capitalizing name input
    set: capitalize,
  },
  pokeType: {
    type: String,
    enum: ["Electro", "Fire", "Water"],
  },
  hitpoints: {
    // different data types like number -
    // there are others and you can look at the docs to find out how to use them
    // boolean and date are common examples
    type: Number,
    default: 10,
  },
  moves: {
    // array of strings as a datatype
    type: [String],
  },
});

// compiling the schema to a model
// the model can be re-used to
const Pokemon = mongoose.model("Pokemon", pokemonSchema);

// use the model to create a document (think class vs. instance)
const pikachu = new Pokemon({
  name: "pikachu",
  pokeType: "Electro",
  hitpoints: 100,
  moves: ["Thunderbolt", "Tackle"],
});

const raichu = new Pokemon({
  name: "Raichu!",
  pokeType: "Electro",
  hitpoints: 100,
  moves: ["Thunderbolt", "Tackle"],
});

// actually save the model to the db.
// keep in mind that it's async - it takes time to save something to a db -
// so we have to await the result before continuing
await pikachu.save();
await raichu.save();

// this will break because of unique name constraint
// const pikachu2 = new Pokemon({
//   name: "Pikachu",
//   hitpoints: 110,
//   moves: ["Thunderbolt", "Tackle"],
// });
// await pikachu2.save();

// add another pokemon
const charmander = new Pokemon({
  name: "Charmander!",
  pokeType: "Fire",
  hitpoints: 150,
  moves: ["Thunderbolt", "Tackle"],
});
await charmander.save();

// and another
const squirtle = new Pokemon({
  name: "Squirtle!",
  pokeType: "Water",
});
await squirtle.save();

// querying for all Pokemon -> no filter specified
console.log(await Pokemon.find());

// querying db for Pokemon with type Electro
console.log(await Pokemon.find({ pokeType: "Electro" }));

// update a single pokemon -> charmander to have moves -> ["Flamethrower"]
await Pokemon.updateOne({ name: "Charmander" }, { moves: ["Flamethrower"] });

// see if update was successful
console.log(await Pokemon.find({ name: "Charmander" }));

// retrieve id of a document
console.log(pikachu._id);

// log the old moves
console.log(pikachu.moves);

// update Pikachu by _id
await Pokemon.updateOne(
  { _id: pikachu._id },
  {
    // add Paralyisis to the old pikachu.moves via ... (spread) operator
    //  -> then remove move "Thunderbolt"
    moves: [...pikachu.moves, "Paralysis"].filter(
      (name) => name !== "Thunderbolt"
    ),
  }
);

// fetch updated version from db
const updatePikachu = await Pokemon.findOne({ name: "Pikachu!" });

// look at moves after update
console.log(updatePikachu.moves);

// find pikachu by _id
console.log(await Pokemon.find({ _id: pikachu._id }));

// countDocuments to get number of documents that match filter
console.log(await Pokemon.countDocuments({ pokeType: "Electro" }));

// this updates everything matching the filter
await Pokemon.updateMany({ pokeType: "Electro" }, { hitpoints: 300 });
console.log(await Pokemon.find({ pokeType: "Electro" }));

// close the connection to the db
await mongoose.connection.close();
