import axiosInstance from '../../src/client/Queries/axios';

describe('test', () => {
  const {
    name,
    desc,
    promUrl,
    promPort,
    faasUrl,
    faasPort,
    grafanaUrl,
    kubeUrl,
    faasUser,
    faasPw,
    costUrl,
    costPort,
  } = Cypress.env('testCluster');
  before(async () => {
    await axiosInstance.post('/auth', {
      firstName: 'John',
      lastName: 'Smith',
      username: 'johnsmith',
      password: 'password',
    });
  });

  before(() => {
    cy.clearCookies();
    cy.visit('http://localhost:3020');
    cy.get('input[name=username]').type('johnsmith');
    cy.get('input[name=password]').type('password');
    cy.contains('Login').click();
  });

  it('should have clusters button', () => {
    cy.get('[data-cy=hamburger]').click();
    cy.contains('Add Cluster').click();
    cy.get('#name').type(name);
    cy.get('#description').type(desc);
    cy.get('#url').type(promUrl);
    cy.get('#k8_port').type(promPort);
    cy.get('#faas_username').type(faasUser);
    cy.get('#faas_password').type(faasPw);
    cy.get('#faas_url').type(faasUrl);
    cy.get('#faas_port').type(faasPort);
    cy.get('#grafana_url').type(grafanaUrl);
    cy.get('#kubeview_url').type(kubeUrl);
    cy.get('#cost_url').type(costUrl);
    cy.get('#cost_port').type(costPort);
    cy.get('[data-cy=add-cluster-button]').click();
    cy.contains(name);
    cy.contains(desc);
    cy.get('#Graphs-Button').click();
    cy.url().should('include', '/module');
    cy.get('#navbar-title').click();
    cy.url().should('include', '/home');
    cy.get('#Alerts-Button').click();
    cy.url().should('include', '/module');
    cy.get('[data-cy=hamburger]').click();
    cy.get('[data-cy=home]').click();
    cy.url().should('include', '/home');
    cy.get('#OpenFaaS-Button').click();
    cy.url().should('include', '/module');
    cy.get('#navbar-title').click();
    cy.url().should('include', '/home');
    cy.get('#FaaSCost-Button').click();
    cy.url().should('include', '/module');
    cy.get('[data-cy=hamburger]').click();
    cy.get('[data-cy=home]').click();
    cy.url().should('include', '/home');
    cy.get('#Kubacus-Button').click();
    cy.url().should('include', '/module');
    cy.get('#navbar-title').click();
    cy.url().should('include', '/home');
    cy.get('#Cluster-Map-Button').click();
    cy.get('.closeButton').click();
    cy.get('#Queries-Button').click();
    cy.get('.closeButton').click();
    cy.get('#settingButton').click();
    cy.get('.Settings-Modal-Container');
    cy.get('#update-cluster-name').type('test');
    cy.get('#update-cluster-description').type('testing');
    cy.contains('Update').click();
    cy.contains('test');
    cy.contains('testing');
    cy.get('#settingButton').click();
    cy.get('.Settings-Modal-Container');
    cy.get('#update-cluster-name').type(name);
    cy.get('#update-cluster-description').type(desc);
  });

  after(() => {
    cy.deleteOne({ username: 'johnsmith' });
    cy.deleteOne({ name }, { collection: 'clusters' });
  });
});
