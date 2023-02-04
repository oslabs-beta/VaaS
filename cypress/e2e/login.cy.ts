import { User } from '../../src/server/models';
import axiosInstance from '../../src/client/Queries/axios';

describe('Login existing user', () => {
  before(async () => {
    await axiosInstance.post('/auth', {
      firstName: 'John',
      lastName: 'Smith',
      username: 'johnsmith',
      password: 'password',
    });
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('http://localhost:3020');
  });

  it('can login existing user', () => {
    cy.get('input[name=username]').type('johnsmith');
    cy.get('input[name=password]').type('password');
    cy.contains('Login').click();
    cy.url().should('include', '/home');
  });

  after(() => {
    cy.deleteOne({ username: 'johnsmith' });
  });
});
