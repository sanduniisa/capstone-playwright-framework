# Covers mocked fruit API payloads, errors, delays, and response headers.
@mocking
Feature: Mock API responses

  Scenario: Mock the fruits API with inline JSON
    Given I mock fruits with these records
      | name       | id |
      | Strawberry | 21 |
      | Banana     | 22 |
      | Mango      | 23 |
    When I open the mocking demo
    Then the page should display fruit "Strawberry"
    And the page should display fruit "Banana"
    And the page should display fruit "Mango"

  Scenario: Load mock data from the shared fruits JSON file
    Given I mock fruits using the shared "fruits.json" file
    When I open the mocking demo
    Then the page should display fruit "Dragon Fruit"

  Scenario: Simulate an API server error
    Given I mock the fruits API with status 500 and error "Internal Server Error"
    When I open the mocking demo
    Then the page should not display fruit "Strawberry"
    And the fruits API response status should be 500

  Scenario: Simulate an empty API response
    Given I mock the fruits API with an empty list
    When I open the mocking demo
    Then the page should not display fruit "Strawberry"
    And the fruits API response status should be 200

  Scenario: Simulate a delayed API response
    Given I mock fruits with a 2 second delay and record "Delayed Fruit"
    When I open the mocking demo
    Then the page should display fruit "Delayed Fruit" within 10 seconds

  Scenario: Return a custom response header
    Given I mock fruits with "Header Fruit" and response header "x-mock-source" value "cucumber"
    When I open the mocking demo
    Then the page should display fruit "Header Fruit"
    And the fruits API response header "x-mock-source" should be "cucumber"