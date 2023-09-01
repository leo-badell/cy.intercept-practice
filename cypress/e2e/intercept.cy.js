/// <reference types="cypress" />

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
    .should('be.visible').click().focus()
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



})













