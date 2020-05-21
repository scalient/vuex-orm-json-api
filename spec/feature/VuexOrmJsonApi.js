import {describe, expect, it} from "@jest/globals";
import {createStore} from "spec/support/spec_helper";

describe("Feature - Vuex ORM JSON:API", () => {
  it("mixes the adapter's configuration into models", () => {
    let store = createStore("users", "groups", "users_groups");
    let {users: User} = store.$db().models();

    expect(User).toHaveProperty("setAxios");
    expect(User).toHaveProperty("globalJsonApiConfig");
    expect(User).toHaveProperty("jsonApiConfig");
    expect(User).toHaveProperty("jsonApi");
  });
});
