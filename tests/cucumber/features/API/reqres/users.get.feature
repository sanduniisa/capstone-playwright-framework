# Covers ReqRes user lookups, pagination, and GET response validation.
@api @reqres
Feature: ReqRes GET users

  Scenario: TC001 GET users returns a valid user list
    When I request ReqRes users page "2"
    Then ReqRes response status should be 200
    And ReqRes response content type should be JSON
    And ReqRes user list should be page 2 with 6 results

  Scenario Outline: <id> GET users with page <query>
    When I request ReqRes users page "<query>"
    Then ReqRes response status should be 200
    And ReqRes user list should be page <expectedPage> with <expectedCount> results

    Examples:
      | id    | query     | expectedPage | expectedCount |
      | TC002 | 1         | 1            | 6             |
      | TC003 | 2         | 2            | 6             |
      | TC004 | 0         | 1            | 6             |
      | TC005 | -1        | -1           | 6             |
      | TC006 | abc       | 1            | 6             |
      | TC007 | 999999999 | 999999999    | 0             |

  Scenario: TC008 GET users with page missing defaults to page 1
    When I request ReqRes users without a page parameter
    Then ReqRes response status should be 200
    And ReqRes user list should be page 1 with 6 results

  Scenario: TC009 GET users pagination
    When I request ReqRes users page "2"
    Then ReqRes response status should be 200
    And ReqRes user list should be page 2 with 6 results

  Scenario: TC025 GET users with a query parameter
    When I request ReqRes users page "1"
    Then ReqRes response status should be 200
    And ReqRes response content type should be JSON
    And ReqRes user list should be page 1 with 6 results

  Scenario: TC026 GET user with a path parameter
    When I request ReqRes user 2
    Then ReqRes response status should be 200
    And ReqRes response content type should be JSON
    And ReqRes response user ID should be 2
