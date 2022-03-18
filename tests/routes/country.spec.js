/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Country, conn } = require("../../src/db.js");

const agent = session(app);
const country = {
  name: "Argentina",
};

describe("Country routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(
    () => Country.sync()
    //.then(() => Country.create(country))
  );
  describe("GET /countries", () => {
    it("should get 200", () => agent.get("/countries").expect(200));
  });
  describe("GET /countries/:idPais", () => {
    let fakeID = "ADS";
    it("aswer code should be 400 because the id doesnt exist", (done) => {
      () => agent.get(`/countries/${fakeID}`).expect(404);
      done();
    });
    let trueID = "COL";
    it("should get 200 because the id exist", () =>
      agent.get(`/countries/${trueID}`).expect(200));
  });
});
