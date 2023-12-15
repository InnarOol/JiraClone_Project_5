describe('Issue Deletion', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    it('Test Case 1: Issue Deletion', () => {
        // Open the issue deletion confirmation modal
        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('[data-testid="icon:trash"]').click();
        });

        // Confirm issue deletion
        cy.get('[data-testid="modal:confirm"]').should('contain', 'Are you sure you want to delete this issue?');
        cy.get('.sc-bxivhb.rljZq').contains('Delete issue').click();

        // Assert issue is deleted and no longer on the board
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        cy.get('[data-testid="board-list:backlog"]').within(() => {
            cy.contains('This is an issue of type: Task.').should('not.exist');
        });
    });

    it('Test Case 2: Issue Deletion Cancellation', () => {
        // Open the issue deletion confirmation modal
        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('[data-testid="icon:trash"]').click();
        });

        // Cancel issue deletion
        cy.get('[data-testid="modal:confirm"]').should('contain', 'Are you sure you want to delete this issue?');
        cy.get('.sc-bxivhb.rljZq').contains('Cancel').click();

        // Assert issue is not deleted and still on the board
        cy.reload();
        cy.get('[data-testid="board-list:backlog"]').within(() => {
            cy.contains('This is an issue of type: Task.').should('exist');
        });
    });
});
