const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'yadm4v',
  "video": true,
  defaultCommandTimeout: 5000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
