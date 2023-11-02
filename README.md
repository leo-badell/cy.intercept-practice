# cy.intercept-practice
Intercepting and mocking network requests. 

This is the website: https://opensource-demo.orangehrmlive.com/

This is the API documentation: https://orangehrm.github.io/orangehrm-api-doc/

This Cypress test suite is designed to thoroughly test various features of the Orange HRM website. It includes tests for logging in, posting articles, and verifying content on the site. The suite also demonstrates the use of cy.intercept and cy.request for API testing.

Key Test Cases:

Log in to the Website: This test case logs in to the Orange HRM website, intercepts requests, and posts an article. It checks for the successful posting of the article.

Changing Employee's Distribution by Sub-Unit: This test case verifies the names of sub-units on a pie chart using a new JSON format.

Changing Employee's Distribution by Location: This test case intercepts a request and changes the names of locations on the pie chart using a new JSON format.

Verifying the Buzz Newsfeed: This test case verifies the Buzz newsfeed, checks for specific elements, and simulates liking a post.

Deleting Post from the Buzz Newsfeed: This test case practices using cy.request with POST methods. It logs in, posts an article, deletes the article, and confirms its removal.

The test suite demonstrates Cypress capabilities for end-to-end testing and API testing while providing detailed comments for each step.
