/// <reference types="cypress" />
describe('Login Page E2E Test', () => {
    beforeEach(() => {
        cy.visit('/login'); // Adjust base URL in cypress.config.js if needed
    });

    it('should display the login form', () => {
        cy.contains('AYD - Storage').should('be.visible');
        cy.get('#userInput').should('be.visible');
        cy.get('#passwordInput').should('be.visible');
        cy.contains('Iniciar sesión').should('be.visible');
        cy.contains('Pagar un Mes').should('be.visible');
    });

    it('should login with valid credentials', () => {
        cy.get('#userInput').type('Alex');
        cy.get('#passwordInput').type('123');
        cy.get('button[type="submit"]').click();

        // Assert the login status - adjust based on your application's behavior
        cy.get('.MuiAlert-root').should('not.be.visible');  // Assuming alert is hidden on success
        // Verify redirection or page content that confirms successful login
        cy.url().should('not.include', '/login');  // Confirm it redirects after login
    });

    it('should show an error with invalid credentials', () => {
        cy.get('#userInput').type('invalidUsername');
        cy.get('#passwordInput').type('invalidPassword');
        cy.get('button[type="submit"]').click();

        // Check if error alert is visible
        cy.get('.MuiAlert-root')
            .should('be.visible')
            .and('contain', 'Error - Login incorrecto: Failed to fetch'); // Adjust text based on actual error message
    });

    it('should navigate to registration page when clicking "¿No tienes una cuenta?"', () => {
        cy.contains('¿No tienes una cuenta?').click();
        cy.url().should('include', '/registrate');
    });

    it('should navigate to forgot password page when clicking "¿Olvidaste tu Contraseña?"', () => {
        cy.contains('¿Olvidaste tu Contraseña?').click();
        cy.url().should('include', '/forgotPassword');
    });

    it('should handle "Pagar un Mes" button click', () => {
        cy.contains('Pagar un Mes').click();
        // Add assertions based on what is expected to happen (e.g., redirect, alert message, etc.)
        // For example, if it shows a payment modal or redirects:
        // cy.url().should('include', '/payment');
    });
});
