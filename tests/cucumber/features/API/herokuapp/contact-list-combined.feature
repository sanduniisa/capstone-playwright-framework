# Covers Contact List workflows shared between the browser and API.
@integration @contact-list-ui @contact-list-api
Feature: Contact List UI and API integration

  Scenario: TC030 API registration and UI verification
    Given I register and log in a Contact List user for "TC030"
    When I sign in to the Contact List UI with that user
    Then the Contact List page should be displayed

  Scenario: TC031 UI contact creation is visible through the API
    Given I register and log in a Contact List user for "TC031"
    When I sign in to the Contact List UI with that user
    And I create a Contact List contact for "TC031"
    When I fetch contacts for that user through the API
    Then the Contact List API response status should be 200
    And Contact List API response should include the created contact

  Scenario: TC032 API authentication can open the UI without logging in
    Given I register and log in a Contact List user for "TC032"
    When I open the Contact List UI using the API token
    Then the Contact List page should be displayed

  Scenario: TC033 API and UI checks can run in parallel
    Given I register and log in a Contact List user for "TC033"
    When I check the Contact List API and UI in parallel
    Then the Contact List API response status should be 200
    And the Contact List UI title should be visible

