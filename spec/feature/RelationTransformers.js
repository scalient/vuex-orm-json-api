import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {describe, it, beforeEach, afterEach} from "@jest/globals";
import {createStore, assertState} from "spec/support/spec_helper";

describe("Feature - Relation Transformers", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("transforms the `BelongsTo` relation", async () => {
    const store = createStore("users", "groups", "users_groups");
    const {users_groups: UsersGroup} = store.$db().models();

    mock.onGet("/api/users_groups/1").reply(200, {
      data: {
        id: 1,
        type: "users-groups",
        relationships: {
          user: {
            data: {id: 1, type: "users"}
          },
          group: {
            data: {id: 1, type: "groups"}
          }
        }
      },
      included: [
        {id: 1, type: "users", attributes: {name: "Harry Bovik"}},
        {id: 1, type: "groups", attributes: {name: "CMU"}}
      ]
    });

    await UsersGroup.jsonApi().show(1);

    // This is also testing that the explicit `id` mandated by JSON:API can coexist with the true, composite key `$id`.
    assertState(store, {
      users: {
        1: {$id: "1", id: 1, name: "Harry Bovik", users_groups: [], groups: []}
      },
      groups: {
        1: {$id: "1", id: 1, name: "CMU", users_groups: [], users: []}
      },
      users_groups: {
        "[1,1]": {$id: "[1,1]", id: 1, user_id: 1, user: null, group_id: 1, group: null}
      }
    });
  });

  it("transforms the `BelongsToMany` relation", async () => {
    const store = createStore("users", "groups", "users_groups");
    const {users: User} = store.$db().models();

    mock.onGet("/api/users/1").reply(200, {
      data: {
        id: 1,
        type: "users",
        attributes: {
          name: "Harry Bovik"
        },
        relationships: {
          groups: {
            data: [
              {id: 1, type: "groups"},
              {id: 2, type: "groups"},
              {id: 3, type: "groups"}
            ]
          }
        }
      },
      included: [
        {id: 1, type: "groups", attributes: {name: "A"}},
        {id: 2, type: "groups", attributes: {name: "B"}},
        {id: 3, type: "groups", attributes: {name: "C"}}
      ]
    });

    await User.jsonApi().show(1);

    assertState(store, {
      users: {
        1: {$id: "1", id: 1, name: "Harry Bovik", users_groups: [], groups: []}
      },
      groups: {
        1: {$id: "1", id: 1, name: "A", users_groups: [], users: []},
        2: {$id: "2", id: 2, name: "B", users_groups: [], users: []},
        3: {$id: "3", id: 3, name: "C", users_groups: [], users: []}
      },
      users_groups: {
        "[1,1]": {$id: "[1,1]", id: null, user_id: 1, user: null, group_id: 1, group: null},
        "[1,2]": {$id: "[1,2]", id: null, user_id: 1, user: null, group_id: 2, group: null},
        "[1,3]": {$id: "[1,3]", id: null, user_id: 1, user: null, group_id: 3, group: null}
      }
    });
  });
});
