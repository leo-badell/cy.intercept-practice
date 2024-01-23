/// <reference types="cypress" />

describe('Testing Orange HRM', () => {
  beforeEach('log in to the website', () => {
    cy.logInToOrangeHRM("Succefully logged in");
  });

  // This step is to log in to the website
  it('Log in', () => {
    cy.log('I\'m in!!!');

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
  it('Changing the Employee\'s Distribution by Sub-Unit', () => {
     cy.intercept({method:'GET', path:'subunit'}, { fixture: 'dashboard.json' });
    cy.get('.oxd-sheet')
      .should('contain', 'Teste 1')
      .and('contain', 'Teste 2')
      .and('contain', 'Teste 3')
      .and('contain', 'Teste 4')
      .and('contain', 'Teste 5');
  });


  // This step is for changing the names of locations on the pie chart using a new JSON format.
  it('Changing the Employee\'s Distribution by Location', () => {
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
      cy.intercept('POST', `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/shares/${file.data[targetPostIndex].id}/likes`, {
        statusCode: 200,
        body: file.data[targetPostIndex]
      }).as('likeRequest');

      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz');

      cy.get('#heart-svg[class="orangehrm-heart-icon"]')
        .eq(targetPostIndex)
        .click({ force: true });

      cy.wait('@likeRequest');
    });
  });


  // This step is to practice cy.request using POST methods.
  it.only('Deleting post of the Buzznewsfeed', () => {
    const accessOrange = {
      username: "Admin",
      password: "admin123"
    };

    cy.request({
      method: 'POST',
      url: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate',
      body: accessOrange,
      followRedirect: true,
    }).then((response) => {
      expect(response.status).to.equal(200);

      const htmlContent = response.body;
      const tokenMatch = htmlContent.match(/:token="([^"]+)"/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (token) {
        cy.request({
          method: 'POST',
          url: `${baseUrl}web/index.php/auth/validate`,
          headers: {
            Authorization: `Bearer 4287e7dd282.yr4zQuk4Ksp2SNoAc18gaMV-Mt_C6olbCZBhxuzZWMQ.mvAEKI9TE488cLNMPxdlXrIGebf1rbAhSMEF_r60MoGT-0EzoVZbgkQS4g&`
          }
        });
      }

      cy.request({
        method: 'POST',
        url: 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/posts',
        body: {
          "type": "text",
          "text": "Deleting this article with Cypress"
        },
      }).then((postResponse) => {
        expect(postResponse.status).to.equal(200);

        cy.get('.oxd-sidepanel-body');
        cy.get('.oxd-main-menu-item')
          .eq(11)
          .should('contain', 'Buzz')
          .click();

        cy.get('div.oxd-layout-context')
          .find('.oxd-text')
          .should('contain', 'Deleting this article with Cypress');

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

        cy.request({
          url: 'https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz',
          method: 'GET'
        }).then((buzzResponse) => {
          expect(buzzResponse.status).to.equal(200);

          if (buzzResponse.body && Array.isArray(buzzResponse.body.buzz) && buzzResponse.body.buzz.length > 0) {
            expect(buzzResponse.body.buzz[0].title).not.to.equal('Deleting this article with Cypress');
          }
        });
      });
    });
  });
});
