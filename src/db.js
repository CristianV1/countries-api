require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");
const { count } = require("console");
const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
  },
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("conexion correcta");
  })
  .catch((err) => console.log(err));
const basename = path.basename(__filename);

const modelDefiners = [];
const Op = Sequelize.Op;
// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
//const { Pokemon } = sequelize.models;
const { Country, Tourism_activity } = sequelize.models;
console.log(sequelize.models);

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Country.belongsToMany(Tourism_activity, { through: "country_tourismActivity" });
Tourism_activity.belongsToMany(Country, { through: "country_tourismActivity" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
  Op: Op,
};
