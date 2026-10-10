# Covers saved-token Contact List API access and token-based UI authentication.
@api @contact-list-api
Feature: Contact List API

  Scenario: TC_API_AUTH_001 saved token can read contacts
    Given I use the saved Contact List API authentication
    When I request the authenticated Contact List contacts
    Then Contact List API response status should be 200
    And Contact List API response should be a JSON array

  Scenario: TC_API_AUTH_002 saved token can create and read a contact
    Given I use the saved Contact List API authentication
    When I create a unique Contact List contact for "CUC_API"
    Then Contact List API response status should be 201
    When I request the authenticated Contact List contacts
    Then Contact List API response status should be 200
    And Contact List API response should include the created contact

  @contact-list-ui
  Scenario: TC_API_UI_AUTH_001 saved bearer token authenticates API and UI
    Given I use the saved Contact List API authentication
    When I request the authenticated Contact List contacts
    Then Contact List API response status should be 200
    When I open the Contact List UI using the API token
    Then the Contact List page should be displayed