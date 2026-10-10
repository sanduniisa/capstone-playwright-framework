# Covers partial ReqRes user updates and returned timestamps.
@api @reqres
Feature: ReqRes PATCH users

  Scenario Outline: <id> PATCH updates the supplied fields
    When I partially update ReqRes user 2 with JSON '<requestBody>'
    Then ReqRes response status should be 200
    And ReqRes response body should contain JSON '<expectedBody>'
    And ReqRes response should include an update timestamp

    Examples:
      | id    | requestBody                     | expectedBody                    |
      | TC019 | {"name":"Sanduni"}             | {"name":"Sanduni"}             |
      | TC020 | {"job":"Senior QA Engineer"}   | {"job":"Senior QA Engineer"}   |
      | TC021 | {"name":"","team":"Testing"} | {"name":"","team":"Testing"} |
