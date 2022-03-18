const { Router } = require("express");
const axios = require("axios");
const { Op, conn, Country, Tourism_activity } = require("../db");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

router.get("/countries", async (req, res) => {
  try {
    let firstSearch = await Country.findAll();
    if (req.query.name) {
      let countries = await Country.findAll({
        where: { name: { [Op.iLike]: `${req.query.name}%` } },
        include: [Tourism_activity],
      });
      console.log(countries);
      if (countries.length === 0) {
        return res.json([{ error: "country not found" }]);
      }
      return res.json(countries);
    }

    let countries = await Country.findAll({
      attributes: ["name", "flag", "continent", "id", "population"],
      include: [Tourism_activity],
    });

    if (firstSearch.length === 0) {
      let url = "https://restcountries.com/v2/all";
      let apiData = await axios(url)
        .then((response) => response.data)
        .catch((error) => {
          console.log(error);
        });

      for (let index = 0; index < apiData.length; index++) {
        await Country.create({
          id: apiData[index].alpha3Code,
          name: apiData[index].name,
          area: apiData[index].area,
          flag: apiData[index].flags.png,
          continent: apiData[index].region,
          subregion: apiData[index].subregion,
          capital: apiData[index].capital,
          population: apiData[index].population,
        });
      }
    }
    return res.json(countries);
  } catch (err) {
    return res.json(err);
  }
});

router.get("/countries/:idPais", async (req, res) => {
  try {
    let country = await Country.findAll({
      where: { id: req.params.idPais },
      include: Tourism_activity,
    });
    /*if (country.length === 0) {
    return res.status(404).send({
      messagge: "country not found",
    });
  }*/
    return res.json(country);
  } catch (err) {
    return res.json(err);
  }
});

router.get("/activities", async (req, res) => {
  try {
    let tourismActivities = await Tourism_activity.findAll({
      attributes: ["name", "dificulty", "duration", "season", "id"],
    });
    return res.json(tourismActivities);
  } catch (err) {
    return res.json(err);
  }
});

router.post("/activity", async (req, res) => {
  try {
    let activity = {
      name: req.body.name,
      dificulty: req.body.dificulty,
      duration: req.body.duration,
      season: req.body.season,
      countries: req.body.selectedCountries,
    };
    if (
      activity.name === undefined ||
      activity.dificulty === undefined ||
      activity.duration === undefined ||
      activity.season === undefined ||
      activity.countries.length < 1
    ) {
      return res.json(
        "No se recibieron los parámetros necesarios para crear el Post"
      );
    }
    console.log("A LLEGADO HASTA EL BACK");

    const tourism_activity = await Tourism_activity.create({
      name: activity.name,
      dificulty: activity.dificulty,
      duration: activity.duration,
      season: activity.season,
    });
    let countriesID = [];
    activity.countries.forEach((element) => {
      countriesID.push(element.value);
    });
    (await tourism_activity).addCountries([...countriesID]);
    //console.log(await tourism_activity.getCountries());

    //let newActivity = await Tourism_activity.create(activity);
    return res.json(activity);
  } catch (err) {
    return res.json(err);
  }
});

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
