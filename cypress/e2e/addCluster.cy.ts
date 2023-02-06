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
    cy.contains('button', 'Clusters').click();
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
    cy.get('[data-cy=add-cluster-button').click();
  });

  after(() => {
    cy.deleteOne({ username: 'johnsmith' });
    cy.deleteOne({ name }, { collection: 'clusters' });
  });
});
