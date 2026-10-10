// Shared UI test data kept outside the spec to separate scenario values from test logic.
export const loginScenarios = [
  {
    id: "TC_001",
    username: "standard_user",
    password: "secret_sauce",
    description: "valid credentials redirect to inventory",
  },
] as const;

export const loginErrorScenarios = [
  {
    id: "TC_002",
    username: "invalid_user",
    password: "wrong_password",
    expectedMessage: "Username and password do not match",
    description: "invalid credentials show an error",
  },
  {
    id: "TC_003",
    username: "locked_out_user",
    password: "secret_sauce",
    expectedMessage: "Sorry, this user has been locked out",
    description: "locked out users show an error",
  },
  {
    id: "TC_004",
    username: "",
    password: "secret_sauce",
    expectedMessage: "Username is required",
    description: "an empty username shows an error",
  },
  {
    id: "TC_005",
    username: "standard_user",
    password: "",
    expectedMessage: "Password is required",
    description: "an empty password shows an error",
  },
  {
    id: "TC_006",
    username: "",
    password: "",
    expectedMessage: "Username is required",
    description: "empty credentials show an error",
  },
] as const;
