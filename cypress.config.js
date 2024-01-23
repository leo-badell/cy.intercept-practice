const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'yadm4v',
  "video": true,
  env: {
    baseUrl: "https://opensource-demo.orangehrmlive.com/",
    username: "Admin",
    password: "admin123"
  },
  defaultCommandTimeout: 5000,
  e2e: {
    setupNodeEvents(on, config) {
    
    },
  },
});
