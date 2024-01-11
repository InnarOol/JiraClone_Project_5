describe('Issue comments creating, editing and deleting', () => {
    // Function to get the issue details modal
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    // Function to add a comment to an issue
    function addComment(comment) {
        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...').click(); // Click to open comment box
            cy.get('textarea[placeholder="Add a comment..."]').type(comment); // Type the comment
            cy.contains('button', 'Save').click(); // Click save button to add comment
        });
    }

    // Function to edit an existing comment
    function editComment(oldComment, newComment) {
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .contains(oldComment)
                .parent()
                .contains('Edit')
                .click();
            cy.get('textarea[placeholder="Add a comment..."]').should("contain", oldComment)
                .clear()
                .type(newComment);
            cy.contains('button', 'Save').click();
        });
    }

    // Function to delete a comment
    function deleteComment(comment) {
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .contains(comment)
                .parent()
                .contains('Delete')
                .click();
        });

        cy.get('[data-testid="modal:confirm"]').should('exist');
        cy.get('div.sc-bxivhb.rljZq').contains('Delete comment').click();
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
    }

    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    // Test to verify adding, editing, and deleting a comment
    it('Should add, edit, and delete a comment successfully', () => {
        const commentToAdd = 'TEST_COMMENT';
        const editedComment = 'TEST_COMMENT_EDITED';
        //Add comment and verify that the comment was added
        addComment(commentToAdd);
        cy.get('[data-testid="issue-comment"]').should('contain', commentToAdd);
        //Edit the comment and verify that the comment was edited
        editComment(commentToAdd, editedComment); // Edit the comment
        cy.get('[data-testid="issue-comment"]').should('contain', editedComment);
        // Delete the comment and verify that the comment was deleted
        deleteComment(editedComment);
        cy.get('[data-testid="issue-comment"]').should('not.contain', editedComment);
    });
});
