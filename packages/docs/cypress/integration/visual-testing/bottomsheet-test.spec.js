import {  environment } from "../../../utils";
describe("Visual Regression Testing", () => {
  before(() => {
    cy.eyesOpen({
      appName: "Vuetify",
      testName: "bottomsheet page",
      browser: Object.assign(environment, {width: 800})
    });
    cy.visit("/bottom-sheets");
  });
  after(() => {
    cy.eyesClose();
  });

  it("check usage bottomsheet", () => {
    cy.get(".mb-5 .v-sheet .v-btn.theme--dark.purple").click();
    cy.get('.v-snack__content .v-icon').click({force: true});
    cy.wait(500);
    cy.eyesCheckWindow({
      sizeMode: "selector", //mode
      selector:".v-dialog__content.v-dialog__content--active"
    });
    cy.get('.mb-5 .v-sheet .v-btn.theme--dark.purple').click({force: true});
    cy.wait(500);
  });

  it("check example bottomsheet", () => {
    cy.get(".mb-5 .v-sheet .v-btn.theme--dark.red").click();
    cy.eyesCheckWindow({
      sizeMode: "selector", //mode
      selector: ".v-dialog__content.v-dialog__content--active"
    });
    cy.get('.mb-5 .v-sheet .v-btn.theme--dark.red').click({force: true});
    cy.wait(500);
  });
});