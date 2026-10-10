# Covers ReqRes user creation with valid and varied payloads.
@api @reqres
Feature: ReqRes POST users

  Scenario: TC010 POST creates a user
    When I create a ReqRes user with JSON '{"name":"Sanduni","job":"Senior QA Engineer"}'
    Then ReqRes response status should be 201
    And ReqRes response body should contain JSON '{"name":"Sanduni","job":"Senior QA Engineer"}'
    And ReqRes response should include generated ID and timestamp

  Scenario Outline: <id> POST preserves the submitted user payload
    When I create a ReqRes user with JSON '<requestBody>'
    Then ReqRes response status should be 201
    And ReqRes response body should contain JSON '<expectedBody>'
    And ReqRes response should include generated ID and timestamp

    Examples:
      | id    | requestBody                                        | expectedBody                                       |
      | TC011 | {"job":"Senior QA Engineer"}                     | {"job":"Senior QA Engineer"}                     |
      | TC012 | {"name":"","job":"Senior QA Engineer"}         | {"name":"","job":"Senior QA Engineer"}         |
      | TC013 | {"name":null,"job":"Senior QA Engineer"}        | {"name":null,"job":"Senior QA Engineer"}        |
      | TC014 | {"name":123,"job":true}                          | {"name":123,"job":true}                          |
      | TC015 | {"name":"Sanduni","job":"QA","random":"abc"} | {"name":"Sanduni","job":"QA","random":"abc"} |
