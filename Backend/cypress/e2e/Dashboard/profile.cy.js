/// <reference types="cypress" />
describe('User Profile Data Page Presence Test', () => {
    beforeEach(() => {
        // Visit the login page and log in
        cy.visit('/login');
        
        // Log in with valid credentials
        cy.get('#userInput').type('Alex');
        cy.get('#passwordInput').type('123');
        cy.get('button[type="submit"]').click();

        // Verify redirect and visit the /cloud/usuario page
        cy.url().should('not.include', '/login');
        cy.visit('/cloud/usuario');
        
        // Wait briefly to ensure all elements load
        cy.wait(1000);
    });

    it('should display the profile data form fields', () => {
        // Check for "Datos de Perfil" heading
        cy.contains('Datos de Perfil').should('be.visible');

        // Check for text fields (Name, Last Name, Username, Password, Email)
        cy.get('input[name="firstname"]').should('be.visible');
        cy.get('input[name="lastname"]').should('be.visible');
        cy.get('input[name="username"]').should('be.visible').and('be.disabled');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible').and('be.disabled');

        // Check for phone code and phone number fields
        cy.get('input[name="phone_number"]').should('be.visible');

        // Check for country and nationality fields
        cy.get('input[name="nationality"]').should('be.visible');

        // Check for "Cambiar Datos" submit button
        cy.contains('Cambiar Datos').should('be.visible');

    });
});
