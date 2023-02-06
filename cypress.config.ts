import { defineConfig } from 'cypress';
import { configurePlugin } from 'cypress-mongodb';

/**
 * @type {Cypress.PluginConfig}
 */

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      configurePlugin(on);
    },
  },
});
