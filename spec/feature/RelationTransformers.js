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

    assertState(store, {
      users: {
        1: {$id: "1", id: 1, name: "Harry Bovik", users_groups: []}
      },
      groups: {
        1: {$id: "1", id: 1, name: "CMU", users_groups: []}
      },
      users_groups: {
        1: {$id: "1", id: 1, user_id: 1, user: null, group_id: 1, group: null}
      }
    });
  });
});
