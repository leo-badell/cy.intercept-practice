/// <reference types="cypress" />

// const { method } = require("cypress/types/bluebird");

describe('Testing Orange HRM', () => {

  beforeEach('log in to the website', () => { 
    cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/subunit', {fixture: 'dashboard.json'})
    cy.logInToOrangeHRM(); 
  })


  //This is the first step to log in to the Orange HRM website. I've also published a post.
  it('Log in', () => {

    cy.log('I\'m in!!!')


    cy.get('.oxd-sidepanel-body')
    cy.get('.oxd-main-menu-item')
    .eq(11)
    .should('contain', 'Buzz').click()
    
    cy.intercept('POST', 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/posts').as('postMethod')
    
    cy.get('[placeholder="What\'s on your mind?"]').type('Today is a good day to test')
    .should('be.visible').click()
    cy.get('.oxd-button').eq(0).click({force: true})
   
    cy.get('@postMethod').then( xhr => {
      console.log(xhr)

    })
  })

  
  //In this second step, I've manipulated the Sub-Unit JSON to change the name of each unit.
  it('Changing the Employee\'s Distribution by Sub-Unit', () => {
    cy.get('.oxd-sheet')
    .should('contain', 'Teste 1')
    .and('contain', 'Teste 2')
    .and('contain', 'Teste 3')
    .and('contain', 'Teste 4')
    .and('contain', 'Teste 5')

  })


  //Here, I did the same thing as the step before, in order to manipulate the location.
  it('Changing the Employee\'s Distribution by Location', () => {
    cy.intercept('GET','https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/locations', {fixture: 'dashboard2.json'}) 
  
    cy.get('.oxd-grid-item') 
    .should('contain', 'São Paulo')
    .and('contain', 'Rio de Janeiro')
    .and('contain', 'Florianópolis')
    .and('contain', 'Porto Alegre')
    .and('contain', 'Curitiba')

  })
  

  //In this step, I've caught the anniversaries posts in the Buzzfeed, and I've changed the name of three of them.
  it('Verifying the Buzz Newsfeed', () =>  {
    cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/anniversaries*', {"data":[],"meta":{"total":0},"rels":[]}) 
    cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/feed*', {fixture: 'newsfeed.json'})


   
    cy.get('.oxd-sidepanel-body')
    cy.get('.oxd-main-menu-item')
    .eq(11)
    .should('contain', 'Buzz').click()

    cy.get('.oxd-grid-1').should('be.visible').within(() => {
    cy.get('#heart-svg').should('exist');
  
    cy.get('#heart-svg') 
    .find('path.orangehrm-heart-icon-path')
    .should('have.attr', 'fill', '#64728c')

    cy.get('[class="oxd-text oxd-text--p orangehrm-buzz-stats-active"]')
    .should('contain', '5')
    .and('contain', '4')
    .and('contain', '3')
    

  })

  //In this step, I manipulated the endpoint in order to make a POST request.
  cy.fixture('newsfeed').then(file => {
    const targetPostIndex = 1; 
    file.data[targetPostIndex].stats.numOfLikes += 1; 
    cy.intercept('POST', `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/shares/${file.data[targetPostIndex].id}/likes`, {
        statusCode: 200,
        body: file.data[targetPostIndex]
    }).as('likeRequest');

    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz'); 
   
    
    cy.get('#heart-svg[class="orangehrm-heart-icon"]').eq(targetPostIndex).click({force: true});

   
    cy.wait('@likeRequest');

    cy.get('div.orangehrm-buzz-stats-row')

    cy.get('[class="oxd-text oxd-text--p orangehrm-buzz-stats-active"]').eq(targetPostIndex)
    
   
  })


 })

 it.only('Deleting post of the Buzznewsfeed', () => {

  const accessOrange = {
    username: "Admin",
    password: "admin123"
  }
  
  
  // Send the POST request to log in and get the HTML response
  cy.request('POST', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate', accessOrange)
    .then((response) => {
      // Check for a successful login response
      expect(response.status).to.equal(200);

      // Extract the token from the HTML content
      const htmlContent = response.body;
      const tokenMatch = htmlContent.match(/:token="([^"]+)"/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (token) {
        // Use the extracted token for subsequent requests
        // For example, you can make authenticated requests here
        cy.request({
          method: 'POST',
          url: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate', // Replace with the URL you want to access
          headers: {
            Authorization: `Bearer 3ab4d9e61bad2f2ad4ab422f4.OKXRkfph9l0z_usBlr80BcTVi0FZH9C1L-NCRNHGhAA.VdCzxr9WxhZJmb420pJcYImSvBkRJ_3mZIgafZT-6ldy9pD2yADCZEfIog&`

          },
        })
      } else {
        // Handle the case where the token couldn't be extracted
        cy.log("Token not found in HTML.");
      }

      cy.request({
        method: 'POST',
        url: 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/posts', 
        body: {
          "type": "text",
          "text": "Deleting this article with Cypres" // Modify the text as needed
        },
        // failOnStatusCode: false,
      })

      .then((postResponse) => {
        // Check if the post request was successful
        expect(postResponse.status).to.equal(200);


      cy.get('.oxd-sidepanel-body')
      cy.get('.oxd-main-menu-item')
      .eq(11)
      .should('contain', 'Buzz').click()


      cy.contains('p.oxd-text', 'Deleting this article with Cypres')
 
  cy.get('button.oxd-icon-button').eq(0).click()



      Cypress.Commands.add('deletePost', () => {
       
        cy.get('.bi-trash')
      .should('contain','Delete Post').eq(0).click(); 
      });

      cy.request({
        url: 'https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz',
        method: 'GET'
      }).then((buzzResponse) => {
        // Check if the get request was successful
        expect(buzzResponse.status).to.equal(200);

        // Check if the buzz array exists and has items before accessing it
        if (buzzResponse.body && Array.isArray(buzzResponse.body.buzz) && buzzResponse.body.buzz.length > 0) {
          // Check if the article was deleted
          expect(buzzResponse.body.buzz[0].title).not.to.equal('Deleting this article with Cypres');
        }
});


 })

})
})
})

















