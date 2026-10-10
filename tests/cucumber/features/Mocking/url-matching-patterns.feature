# Covers route matching with glob, regular-expression, and predicate patterns.
@mocking
Feature: URL matching patterns

  Scenario Outline: Match the fruits route using <matching>
    Given I mock fruits with matching strategy "<matching>" and fruit "<fruit>"
    When I open the mocking demo
    Then the page should display fruit "<fruit>"

    Examples:
      | matching             | fruit           |
      | a glob pattern       | Glob Fruit      |
      | a regular expression | Regex Fruit     |
      | a URL predicate      | Predicate Fruit |
      | a GET method check   | Method Fruit    |
