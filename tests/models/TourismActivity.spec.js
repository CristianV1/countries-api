const { Tourism_activity, conn } = require("../../src/db.js");
const { expect } = require("chai");

describe("Country model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  describe("Validators", () => {
    beforeEach(() => Tourism_activity.sync({ force: true }));
    describe("name", () => {
      it("should throw an error if name is null", (done) => {
        Tourism_activity.create({})
          .then(() => done(new Error("It requires a valid name")))
          .catch(() => done());
      });
    });
    describe("dificulty", () => {
      it("should throw an error if dificulty is null", (done) => {
        Tourism_activity.create({ dificulty: null })
          .then(() =>
            done(new Error("not enought parameters to create a new activity"))
          )
          .catch(() => done());
      });
    });
    describe("duration", () => {
      it("should throw an error if duration is null", (done) => {
        Tourism_activity.create({ duration: null })
          .then(() =>
            done(new Error("not enought parameters to create a new activity"))
          )
          .catch(() => done());
      });
    });
    describe("season", () => {
      it("should throw an error if season is null", (done) => {
        Tourism_activity.create({ season: null })
          .then(() =>
            done(new Error("not enought parameters to create a new activity"))
          )
          .catch(() => done());
      });
    });
  });
});
