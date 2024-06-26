

describe('Testing Orange HRM', () => {
  beforeEach('log in to the website', () => {
    cy.logInToOrangeHRM("Succefully logged in");
  });

  // This step is to log in to the website
  it('Log in', () => {
    cy.log(`I'm in!!!`);

    cy.get('.oxd-sidepanel-body');
    cy.get('.oxd-main-menu-item')
      .eq(11)
      .should('contain', 'Buzz')
      .click();

    // This step is to intercept a URL in order to post an article.
    cy.intercept({method:'POST', path:'posts'}).as('postMethod');

    cy.get('[placeholder="What\'s on your mind?"]')
      .type('Today is a good day to test')
      .should('be.visible')
      .click();
    cy.get('.oxd-button')
      .eq(0)
      .click({ force: true });

    cy.get('@postMethod').then((xhr) => {
      console.log(xhr);
    });
  });

  // This step is for changing the names of sub-units on the pie chart using a new JSON format.
  it(`Changing the Employee's Distribution by Sub-Unit`, () => {
     cy.intercept({method:'GET', path:'subunit'}, { fixture: 'dashboard.json' });
    cy.get('.oxd-sheet')
      .should('contain', 'Teste 1')
      .and('contain', 'Teste 2')
      .and('contain', 'Teste 3')
      .and('contain', 'Teste 4')
      .and('contain', 'Teste 5');
  });


  // This step is for changing the names of locations on the pie chart using a new JSON format.
  it(`Changing the Employee's Distribution by Location`, () => {
    cy.intercept({method:'GET', path:'locations'}, { fixture: 'dashboard2.json' });

    cy.get('.oxd-grid-item')
      .should('contain', 'São Paulo')
      .and('contain', 'Rio de Janeiro')
      .and('contain', 'Florianópolis')
      .and('contain', 'Porto Alegre')
      .and('contain', 'Curitiba');
  });


   // This step is for verifying the Buzz newsfeed.
  it('Verifying the Buzz Newsfeed', () => {
    cy.intercept({method:'GET', path:'anniversaries*'}, { "data": [], "meta": { "total": 0 }, "rels": [] });
    cy.intercept({method:'GET', path:'feed*'}, { fixture: 'newsfeed.json' });

    cy.get('.oxd-sidepanel-body');
    cy.get('.oxd-main-menu-item')
      .eq(11)
      .should('contain', 'Buzz')
      .click();

    cy.get('.oxd-grid-1')
      .should('be.visible')
      .within(() => {
        cy.get('#heart-svg')
          .should('exist');

        cy.get('#heart-svg')
          .find('path.orangehrm-heart-icon-path')
          .should('have.attr', 'fill', '#64728c');

        cy.get('[class="oxd-text oxd-text--p orangehrm-buzz-stats-active"]')
          .should('contain', '5')
          .and('contain', '4')
          .and('contain', '3');
      });

    cy.fixture('newsfeed').then((file) => {
      const targetPostIndex = 1;
      file.data[targetPostIndex].stats.numOfLikes += 1;
      cy.intercept('POST', `${Cypress.env(`baseUrl`)}/${file.data[targetPostIndex].id}/likes`, {
        statusCode: 200,
        body: file.data[targetPostIndex]
      })
    });
  });


  // This step is to practice POST methods.
  it('Deleting post of the Buzznewsfeed', () => {
    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('baseUrl')}/web/index.php/auth/validate`,
    }, {
      statusCode: 200,
      body: {
        "username": Cypress.env('username'),
        "password": Cypress.env('password')
      }
    }).as('getValidation');

    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('baseUrl')}/web/index.php/api/v2/buzz/posts`,
    }, {
      statusCode: 200,
      body: {
         "type": "text",
         "text": "Deleting this article with Cypress"
      }
    }).as('getPost');

    cy.get('.oxd-sidepanel-body');
    cy.get('.oxd-main-menu-item')
      .eq(11)
      .should('contain', 'Buzz')
      .click();

    cy.get(':nth-child(1) > .oxd-sheet')
      .find('.orangehrm-buzz-post')
      .find('.orangehrm-buzz-post-header')
      .find('.orangehrm-buzz-post-header-config')
      .find('li > .oxd-icon-button > .oxd-icon')
      .first()
      .click({ force: true });

    cy.get('.oxd-dropdown-menu > :nth-child(1)')
      .should('exist')
      .contains('Delete Post')
      .click();

    cy.get('.oxd-button--label-danger').click();

    cy.intercept({
      url: `${Cypress.env('baseUrl')}/web/index.php/buzz/viewBuzz`,
      method: 'GET'
    }).as('getBuzz')
  });  
});
