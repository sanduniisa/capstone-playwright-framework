# Covers captured network activity and response-event matching.
@mocking
Feature: Network events

  Scenario: Capture browser console messages and network activity
    When I open the mocking demo
    Then at least one request and response should be captured

  Scenario: Wait for a specific successful fruits response
    When I wait for a successful fruits response and open the mocking demo
    Then the fruits API response should be successful
    And the fruits API response should contain a JSON array

  Scenario: Wait for fruits response using a URL glob
    When I wait for a fruits response matching the URL glob and open the mocking demo
    Then the fruits API response should be successful

  Scenario: Collect API requests using the shared mock helper
    Given I start collecting requests containing "/api/" with the shared mock helper
    When I open the mocking demo
    Then at least one matching API request should be collected

  Scenario: Detect failed requests from blocked resources
    Given I block image requests by extension
    When I visit "https://playwright.dev"
    Then at least one failed-request event should be captured
