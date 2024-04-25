// ***********************************************
// This example commands.js shows you how to
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


  
Cypress.Commands.add('logInToOrangeHRM', () => {
  cy.visit(Cypress.env('baseUrl'))

  // Access to username and password placeholders
  cy.get('input[placeholder]').each(($el, index, $list) => {
    const placeholder = $el.attr('placeholder');

    if (/username/i.test(placeholder) || /nombre de usuario/i.test(placeholder)) {
      cy.wrap($el).type('Admin');
    } else if (/password/i.test(placeholder) || /contraseña/i.test(placeholder)) {
      cy.wrap($el).type('admin123');
    }
  })

  cy.get('form').submit()
})




Cypress.Commands.add('getByClass', (className) => {
  return cy.get(`.${className}`)
})
