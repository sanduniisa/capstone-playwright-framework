# Covers full ReqRes user updates and returned timestamps.
@api @reqres
Feature: ReqRes PUT users

  Scenario Outline: <id> PUT replaces a user representation
    When I replace ReqRes user 2 with JSON '<requestBody>'
    Then ReqRes response status should be 200
    And ReqRes response body should contain JSON '<expectedBody>'
    And ReqRes response should include an update timestamp

    Examples:
      | id    | requestBody                                               | expectedBody                                              |
      | TC016 | {"name":"Sanduni","job":"Senior QA Engineer"}          | {"name":"Sanduni","job":"Senior QA Engineer"}          |
      | TC017 | {"job":"QA Engineer"}                                   | {"job":"QA Engineer"}                                   |
      | TC018 | {"name":"","job":"QA Engineer","team":"Testing"} | {"name":"","job":"QA Engineer","team":"Testing"} |
