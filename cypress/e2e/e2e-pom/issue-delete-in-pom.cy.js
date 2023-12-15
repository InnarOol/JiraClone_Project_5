/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal.js";

// Describe the test suite for issue deletion
describe('Issue Deletion Test Suite', () => {
  
  // Define the issue title we are testing with
  const issueTitle = 'This is an issue of type: Task.';

  // Define the setup steps to run before each test
  beforeEach(() => {
    
    // Visit the Jira board page
    cy.visit('/');
    
    // Verify the URL to ensure we are on the correct page
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      // Open the issue detail modal by clicking on the issue title
      cy.contains(issueTitle).click();
    });
  });

  // Test case: Should delete issue successfully
  it('Test Case 1: Delete Issue', () => {
    
    // Get the issue detail modal
    IssueModal.getIssueDetailModal() 
    
    // Click the delete button
    IssueModal.clickDeleteButton()
    
    // Confirm the deletion
    IssueModal.confirmDeletion()
    
    // Ensure the issue is not visible on the board
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle)
  });

  // Test case: Should cancel deletion process successfully
  it('Test Case 2: Cancel Deletion', () => {
    
    // Get the issue detail modal
    IssueModal.getIssueDetailModal() 
    
    // Click the delete button
    IssueModal.clickDeleteButton()
    
    // Cancel the deletion
    IssueModal.cancelDeletion()
    
    // Close the issue detail modal
    IssueModal.closeDetailModal()
    
    // Ensure the issue is still visible on the board
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle)
  });
});
