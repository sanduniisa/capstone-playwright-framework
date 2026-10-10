# Covers ReqRes user deletion and empty success responses.
@api @reqres
Feature: ReqRes DELETE users

  Scenario Outline: <id> DELETE returns an empty success response
    When I delete ReqRes user <userId>
    Then ReqRes response status should be 204
    And ReqRes response body should be empty

    Examples:
      | id    | userId |
      | TC022 | 2      |
      | TC023 | 1      |
      | TC024 | 999    |
