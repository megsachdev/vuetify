import {  environment } from "../../../utils";
describe("Visual Regression Testing", () => {
  before(() => {
    cy.eyesOpen({
      appName: "Vuetify",
      testName: "hover page",
      browser: environment
    });
    cy.visit("/hover");
  });
  after(() => {
    cy.eyesClose();
  });

  it("check usage hover", () => {
    cy.get(".mb-5.v-card.v-sheet:nth-child(3) .v-card").trigger("mouseenter");
    cy.wait(500);
    cy.eyesCheckWindow({
      sizeMode: "selector", //mode
      selector: ".mb-5.v-card.v-sheet:nth-child(3)"
    });
  });

  it("check example hover", () => {
    cy.get(".mb-5.v-card.v-sheet:nth-child(5) .v-card").trigger("mouseenter");
    cy.wait(500);
    cy.eyesCheckWindow({
      sizeMode: "selector", //mode
      selector: ".mb-5.v-card.v-sheet:nth-child(5)"
    });
  });
});
