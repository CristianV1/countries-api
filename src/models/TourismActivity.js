const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("tourism_activity", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkForParameters() {
          if (
            this.dificulty === null ||
            this.name === null ||
            this.duration === null ||
            this.season === null
          ) {
            throw new Error("not enought parameters to create a new activity");
          }
        },
      },
    },
    dificulty: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    season: {
      type: DataTypes.STRING,
    },
  });
};
