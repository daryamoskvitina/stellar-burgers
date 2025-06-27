/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('checkElementExists', (selector, text) => {
  cy.get(selector).should('exist');
  if (text) {
    cy.get(selector).should('exist').contains(text);
  }
});

Cypress.Commands.add('checkModalVisible', (callback) => {
  callback().should('be.visible');
});

Cypress.Commands.add('checkModalNotExist', (callback) => {
  callback().should('not.exist');
});

Cypress.Commands.add('buttonClick', (alias, text) => {
  cy.get(alias).next().contains(text).click();
});
