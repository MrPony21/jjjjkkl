/// <reference types="cypress" />
describe('User Cloud Page Presence Test', () => {
    beforeEach(() => {
        // Visit the login page and log in
        cy.visit('/login');
        
        // Log in with valid credentials
        cy.get('#userInput').type('Alex');
        cy.get('#passwordInput').type('123');
        cy.get('button[type="submit"]').click();

        // Verify redirect and visit the /cloud/usuario page
        cy.url().should('not.include', '/login');
        cy.visit('/cloud/ajustes');
        
        // Wait briefly to ensure all elements load
        cy.wait(1000);
    });

    it('should display the storage package options', () => {
        // Check for the "Paquete de Almacenamiento" heading
        cy.contains('Paquete de Almacenamiento').should('be.visible');

        // Check for the Premium package option
        cy.get('img[alt="Premium"]').should('be.visible');
        cy.contains('Premium - 150 GB').should('be.visible');

        // Check for the Standard package option
        cy.get('img[alt="Standard"]').should('be.visible');
        cy.contains('Standard - 50 GB').should('be.visible');

        // Check for the Basic package option
        cy.get('img[alt="Basic"]').should('be.visible');
        cy.contains('Basic - 15 GB').should('be.visible');

        // Check for the "Cambiar Paquete" button
        cy.contains('Cambiar Paquete').should('be.visible');
    });

    it('should display the delete account section', () => {
        // Check for the "Solicitar Eliminacion de Cuenta" heading
        cy.contains('Solicitar Eliminacion de Cuenta').should('be.visible');

        // Check for the delete account warning text
        cy.contains('Esta Acción es irreversible').should('be.visible');

        // Check for the "Eliminar Cuenta" button
        cy.contains('Eliminar Cuenta').should('be.visible');
    });
});
