import {createStore} from "spec/support/spec_helper";
import User from "spec/models/user";

import {describe, expect, it} from "@jest/globals";

describe("Feature - Vuex ORM JSON:API", () => {
  it("mixes the adapter's configuration into models", () => {
    createStore([User]);

    expect(User).toHaveProperty("setAxios");
    expect(User).toHaveProperty("globalJsonApiConfig");
    expect(User).toHaveProperty("jsonApiConfig");
    expect(User).toHaveProperty("jsonApi");
  });
});
