import { faker } from '@faker-js/faker';
describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      
      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
          .trigger('click');
            
      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      
      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
  it('Custom Issue Creation', () => {
    // Capture the initial count of issues
    cy.get('.sc-RefOD.iFErAO').contains('Backlog').find('.sc-iQKALj.XSDpq').invoke('text').then((text) => {
      const initialCount = parseInt(text, 10);

      // System finds modal for creating issue and does next steps inside of it
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        // Type value to description input field
        cy.get('.ql-editor').type('My bug description');

        // Type value to title input field
        cy.get('input[name="title"]').type('Bug');

        // Select Pickle Rick from reporter dropdown
        cy.get('[data-testid="select:reporterId"]').click();
        cy.get('[data-testid="select-option:Pickle Rick"]').click();

        // Select Highest priority
        cy.get('[data-testid="select:priority"]').click();
        cy.get('[data-testid="select-option:Highest"]').trigger('click');

        // Open issue type dropdown and choose Bug
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Bug"]').trigger('click');

        // Click on button "Create issue"
        cy.get('button[type="submit"]').click();
      });

      // Assert that modal window is closed and successful message is visible
      cy.get('[data-testid="modal:issue-create"]').should('not.exist');
      cy.contains('Issue has been successfully created.').should('be.visible');

      // Reload the page to be able to see the recently created issue
      cy.reload();
      cy.contains('Issue has been successfully created.').should('not.exist');

      // Assert that the issue count has increased by one
      cy.get('.sc-RefOD.iFErAO').contains('Backlog').find('.sc-iQKALj.XSDpq').invoke('text').should((newText) => {
        const newCount = parseInt(newText, 10);
        expect(newCount).to.eq(initialCount + 1);
      });

      // Additional assertions for avatar and icon visibility
      cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
      cy.get('[data-testid="icon:bug"]').should('be.visible');
    });
  });

  it('Random Data Plugin Issue Creation', () => {
    // Generate random data for title and description using faker
    const randomTitle = faker.lorem.word();
    const randomDescription = faker.lorem.sentence();

    // Open and interact with the modal for issue creation
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      
      // Use random data for description
      cy.get('.ql-editor').type(randomDescription);
      
      //Use random data for title
      cy.get('input[name="title"]').type(randomTitle);
      
      // Initially, the issue type "Task" is pre-selected by default in the modal.
      // To test the dropdown functionality, we first change the issue type to "Bug"
      // and then switch it back to "Task". This ensures that the dropdown is
      // interactive and can handle user actions as expected. 
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').trigger('click');
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Task"]').trigger('click');

      // Set priority to Low
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').trigger('click');

      // Select Baby Yoda as the reporter
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist')

    // Assert that the issue has been created and is visible on the board
    cy.contains(randomTitle).should('be.visible');
    
  });
  // Bonus Task 3
  describe('Issue create', () => {
  it.only('Should trim extra spaces from the issue title on the board view', () => {
      // Define the issue title with extra spaces
      const title = ' Hello   world! ';
  
      // Create an issue with the defined title
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
      });
  
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        // Open issue type dropdown and choose an appropriate type (e.g., Story)
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Story"]').trigger('click');
  
        // Type a description
        cy.get('.ql-editor').type('Test description');
  
        // Type the title with extra spaces
        cy.get('input[name="title"]').type(title);
  
        // Select a reporter (e.g., Lord Gaben)
        cy.get('[data-testid="select:userIds"]').click();
        cy.get('[data-testid="select-option:Lord Gaben"]').click();
  
        // Click on the "Create issue" button
        cy.get('button[type="submit"]').click();
      });
  
      // Reload the page to view the created issue on the board
      cy.reload();
  
      // Get the issue title from the board view and trim extra spaces
      cy.contains(title.trim()).should('be.visible');
    });
  });
  
});