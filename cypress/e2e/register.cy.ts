describe('can visit website', () => {
  it('can visit website', () => {
    cy.visit('http://localhost:3020');
  });
});

describe('register page', () => {
  before(() => {
    cy.deleteOne({ username: 'johnsmith' });
  });

  it('can register a new user', () => {
    cy.visit('http://localhost:3020');
    cy.log('clicking register button');
    cy.contains('Register').click();

    cy.log('should be on register page');
    cy.url().should('include', '/register');

    cy.log('filling out form');
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Smith');
    cy.get('input[name=username]').type('johnsmith');
    cy.get('input[name=password]').type('password');

    cy.log('clicking sign up button');
    cy.contains('Sign Up').click();

    cy.log('should be redirected to home page after registering');
    cy.url().should('include', '/home');
  });

  it('can go back to login page from register page', () => {
    cy.visit('http://localhost:3020');
    cy.contains('Register').click();

    cy.log('clicking go back button');
    cy.contains('Go Back').click();
    cy.url().should('not.include', '/login');
  });
});
