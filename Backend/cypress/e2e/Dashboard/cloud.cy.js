/// <reference types="cypress" />
describe('Cloud Page Buttons Presence Test', () => {
    beforeEach(() => {
        // Visit the login page and log in
        cy.visit('/login');
        
        // Log in with valid credentials
        cy.get('#userInput').type('Alex');
        cy.get('#passwordInput').type('123');
        cy.get('button[type="submit"]').click();

        // Verify redirect and visit the /cloud page
        cy.url().should('not.include', '/login');
        cy.visit('/cloud');

        // Wait for a second to ensure all elements load
        cy.wait(1000);
    });

    it('should display the main action buttons on the cloud page', () => {
        // Check "Create New Folder" button presence
        cy.get('[data-testid="CreateNewFolderIcon"]', { timeout: 10000 })
          .should('exist')
          .and('be.visible');

        // Check "Upload File" button presence
        cy.get('[data-testid="UploadFileIcon"]', { timeout: 10000 })
          .should('exist')
          .and('be.visible');

        // Check "Dashboard" button presence
        cy.get('[data-testid="DashboardIcon"]', { timeout: 10000 })
          .should('exist')
          .and('be.visible');

        // Check "My Profile" button presence
        cy.get('[data-testid="AccountCircleRoundedIcon"]', { timeout: 10000 })
          .should('exist')
          .and('be.visible');

        // Check "Trash" button presence
        cy.get('[data-testid="DeleteIcon"]', { timeout: 10000 })
          .should('exist')
          .and('be.visible');

        // Check "Settings" button presence
        cy.get('[data-testid="BuildIcon"]', { timeout: 10000 })
          .should('exist')
          .and('be.visible');

        // Check "Logout" button presence
        cy.get('[data-testid="LogoutIcon"]', { timeout: 10000 })
          .should('exist')
          .and('be.visible');
    });
});
