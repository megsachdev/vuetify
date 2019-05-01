import {  environment } from "../../../utils";
describe("Visual Regression Testing", () => {
  before(() => {
    cy.eyesOpen({
      appName: "Vuetify",
      testName: "dialog page",
      browser: environment
    });
    cy.visit("/dialogs");
  });
  after(() => {
    cy.eyesClose();
  });
  it("check dialog page", () => {
    var dialogs = cy.get(".mb-5 .v-card__text button.v-btn.primary");
    dialogs.each(dialog => { 
      cy.wrap(dialog).click();
      cy.wait(500);
      cy.eyesCheckWindow({
        sizeMode: "selector", //mode
        selector: ".container.page"
      });
      const currentDialog = cy.get('.v-dialog.v-dialog--active');
      let actionButtons = currentDialog.find(".v-card__actions .v-btn, .v-btn.v-btn--icon");
      if (actionButtons) {
        actionButtons.click({multiple:true, force: true});
      } 
      cy.wait(500);
    });
  });
});