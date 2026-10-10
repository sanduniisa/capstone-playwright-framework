# Covers modifications to real API request headers and response data.
@mocking
Feature: Modify API requests and responses

  Scenario: Add a fruit to the real API response
    Given I append "Cucumber Passion Fruit" to the real fruits response
    When I open the mocking demo
    Then the page should display fruit "Cucumber Passion Fruit"

  Scenario: Replace a fruit name in the real API response
    Given I replace the first real fruit with "Mock-Replaced Fruit"
    When I open the mocking demo
    Then the page should display fruit "Mock-Replaced Fruit"

  Scenario: Limit the real API response to two fruits
    Given I limit the real fruits response to 2 items
    When I open the mocking demo
    Then the fruits API response should contain 2 items

  Scenario: Add a header to the real API response
    Given I add response header "x-mock-injected" value "true" to the real fruits response
    When I open the mocking demo
    Then the fruits API response header "x-mock-injected" should be "true"

  Scenario: Add a header to the outgoing API request
    Given I add request header "x-test-session" value "cucumber-session" to the fruits request
    When I open the mocking demo
    Then the outgoing fruits request header "x-test-session" should be "cucumber-session"

  Scenario: Remove a request header before forwarding
    Given I remove request header "user-agent" before forwarding
    When I open the mocking demo
    Then the forwarded request headers should not contain "user-agent"

