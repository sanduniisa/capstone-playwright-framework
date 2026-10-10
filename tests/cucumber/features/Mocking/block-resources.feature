# Covers blocking selected resource types and observing failed requests.
@mocking
Feature: Block resources and replay network traffic

  Scenario: Block image requests by extension
    Given I block image requests by extension
    When I visit "https://playwright.dev"
    Then the page heading should be visible
    And at least one image request should have been blocked
    And at least one failed-request event should be captured

  Scenario: Block image and font resource types
    Given I block image and font resources
    When I visit "https://playwright.dev"
    Then the page heading should be visible

  Scenario: Block analytics scripts
    Given I block common analytics scripts
    When I visit "https://playwright.dev"
    Then the page heading should be visible

  Scenario: Block CSS using a context route
    Given I block CSS requests at context level
    When I visit the page in a new context tab at "https://playwright.dev"
    Then the page heading should be visible

  Scenario: Block resources using the shared mock helper
    Given I block image and CSS requests with the shared mock helper
    When I visit "https://playwright.dev"
    Then the page heading should be visible

  Scenario: Allow only document, script, XHR, and fetch resources
    Given I allow only document, script, XHR, and fetch resources
    When I visit "https://playwright.dev"
    Then the page heading should be visible

