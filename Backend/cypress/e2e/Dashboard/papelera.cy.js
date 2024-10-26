/// <reference types="cypress" />
describe('Trash Page Button Presence Test', () => {
    beforeEach(() => {
        // Visit the login page and log in
        cy.visit('/login');
        
        // Log in with valid credentials
        cy.get('#userInput').type('Alex');
        cy.get('#passwordInput').type('123');
        cy.get('button[type="submit"]').click();

        // Verify redirect and visit the /cloud/papelera page
        cy.url().should('not.include', '/login');
        cy.visit('/cloud/papelera');
        
        // Wait briefly to ensure all elements load
        cy.wait(1000);
    });

    it('should display the trash button', () => {
        // Check for the Trash/Delete button icon
        cy.get('[data-testid="DeleteIcon"]').should('be.visible');
    });
});
