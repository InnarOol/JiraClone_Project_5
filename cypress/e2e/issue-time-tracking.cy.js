describe('Time Estimation and Tracking Tests', () => {
    const estimatedTime = '10';
    const editedEstimatedTime = '20';
    const timeSpent = '2';
    const timeRemaining = '5';

    beforeEach(() => {
        cy.visit('/project/board');
        cy.contains('This is an issue of type: Task.').click();
    });

    // Selectors
    const inputFieldTime = 'input[placeholder="Number"]';
    const timeTrackingModal = '[data-testid="modal:tracking"]';
    const timeTrackingButton = '[data-testid="icon:stopwatch"]';

    function inputEstimation(time) {
        cy.get(inputFieldTime).clear();
        if (time) {
            cy.get(inputFieldTime).type(time);
        }
    }

    function assertEstimationVisibility(time, shouldBeVisible = true) {
        const assertion = shouldBeVisible ? 'be.visible' : 'not.exist';
        cy.contains('div', `${time}h estimated`).should(assertion);
    }

    function inputTimeTracking(timeSpent, timeRemaining) {
        cy.get(timeTrackingButton).click();
        cy.get(timeTrackingModal).within(() => {
            if (timeSpent) {
                cy.get(inputFieldTime).first().clear().type(timeSpent);
            } else {
                cy.get(inputFieldTime).first().clear();
            }

            if (timeRemaining) {
                cy.get(inputFieldTime).last().clear().type(timeRemaining);
            } else {
                cy.get(inputFieldTime).last().clear();
            }

            cy.contains('button', 'Done').click();
        });
    }

    function assertTimeTrackingVisibility(timeSpent, timeRemaining, shouldBeVisible = true) {
        if (shouldBeVisible) {
            cy.contains('div', `${timeSpent}h logged`).should('be.visible');
            cy.contains('div', `${timeRemaining}h remaining`).should('be.visible');
        } else {
            cy.contains('div', 'No time logged').should('be.visible');
        }
    }

    it('Should add, edit, and delete time estimation', () => {
        // Add time estimation
        inputEstimation(estimatedTime);
        assertEstimationVisibility(estimatedTime);

        // Edit time estimation
        inputEstimation(editedEstimatedTime);
        assertEstimationVisibility(editedEstimatedTime);

        // Delete time estimation
        inputEstimation('');
        cy.get(inputFieldTime).should('not.have.value', editedEstimatedTime);
    });

    it('Should add and delete time tracking', () => {
        // Add estimation for time tracking
        inputEstimation(estimatedTime);
        assertEstimationVisibility(estimatedTime);

        // Add time spent and remaining
        inputTimeTracking(timeSpent, timeRemaining);
        assertTimeTrackingVisibility(timeSpent, timeRemaining);

        // Delete spent and remaining time
        inputTimeTracking('', '');
        assertTimeTrackingVisibility(timeSpent, timeRemaining, false);
    });
});
