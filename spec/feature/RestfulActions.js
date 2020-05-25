import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {describe, it, beforeEach, afterEach, expect} from "@jest/globals";
import {createStore, assertState} from "spec/support/spec_helper";
import ModelFactory from "../models/ModelFactory";
import Utils from "../../src/Utils";

describe("Feature - RESTful Actions", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("runs the `index` action", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    mock.onGet("/api/users").reply(200, {
      data: [
        {id: 1, type: "users", attributes: {name: "Harry Bovik"}},
        {id: 2, type: "users", attributes: {name: "Allen Newell"}},
        {id: 3, type: "users", attributes: {name: "Herb Simon"}}
      ]
    });

    const users = await User.jsonApi().index();

    expect(users).toEqual([
      {
        $id: "1",
        id: 1,
        name: "Harry Bovik",
        users_groups: [],
        groups: [],
        user_profile: null,
        user_profile_attributes: [],
        embedded_group_ids: null,
        embedded_groups: []
      },
      {
        $id: "2",
        id: 2,
        name: "Allen Newell",
        users_groups: [],
        groups: [],
        user_profile: null,
        user_profile_attributes: [],
        embedded_group_ids: null,
        embedded_groups: []
      },
      {
        $id: "3",
        id: 3,
        name: "Herb Simon",
        users_groups: [],
        groups: [],
        user_profile: null,
        user_profile_attributes: [],
        embedded_group_ids: null,
        embedded_groups: []
      }
    ]);

    assertState(store, {
      users: {
        1: {
          $id: "1",
          id: 1,
          name: "Harry Bovik",
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: []
        },
        2: {
          $id: "2",
          id: 2,
          name: "Allen Newell",
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: []
        },
        3: {
          $id: "3",
          id: 3,
          name: "Herb Simon",
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: []
        }
      },
      groups: {},
      users_groups: {},
      user_profiles: {},
      user_profile_attributes: {}
    });
  });

  it("runs the `show` action", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    mock.onGet("/api/users/1").reply(200, {
      data: {id: 1, type: "users", attributes: {name: "Harry Bovik"}}
    });

    const user = await User.jsonApi().show(1);

    expect(user).toEqual({
      $id: "1",
      id: 1,
      name: "Harry Bovik",
      users_groups: [],
      groups: [],
      user_profile: null,
      user_profile_attributes: [],
      embedded_group_ids: null,
      embedded_groups: []
    });

    assertState(store, {
      users: {
        1: {
          $id: "1",
          id: 1,
          name: "Harry Bovik",
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: []
        }
      },
      groups: {},
      users_groups: {},
      user_profiles: {},
      user_profile_attributes: {}
    });
  });

  it("runs the `create` action", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    const payload = {
      user: {
        name: "Harry Bovik"
      }
    };

    mock.onPost("/api/users", payload).reply(200, {
      data: {
        id: 1, type: "users", attributes: {name: "Harry Bovik"}
      }
    });

    const user = await User.jsonApi().create(payload);

    expect(user).toEqual({
      $id: "1",
      id: 1,
      name: "Harry Bovik",
      users_groups: [],
      groups: [],
      user_profile: null,
      user_profile_attributes: [],
      embedded_group_ids: null,
      embedded_groups: []
    });

    assertState(store, {
      users: {
        1: {
          $id: "1",
          id: 1,
          name: "Harry Bovik",
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: []
        }
      },
      groups: {},
      users_groups: {},
      user_profiles: {},
      user_profile_attributes: {}
    });
  });

  it("runs the `update` action", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    User.insertOrUpdate({
      data: {
        id: 1,
        name: "Harry Bovik"
      }
    });

    const payload = {
      user: {
        name: "Harry Q. Bovik"
      }
    };

    mock.onPatch("/api/users/1", payload).reply(200, {
      data: {
        id: 1, type: "users", attributes: {name: "Harry Q. Bovik"}
      }
    });

    const user = await User.jsonApi().update(1, payload);

    expect(user).toEqual({
      $id: "1",
      id: 1,
      name: "Harry Q. Bovik",
      users_groups: [],
      groups: [],
      user_profile: null,
      user_profile_attributes: [],
      embedded_group_ids: null,
      embedded_groups: []
    });

    assertState(store, {
      users: {
        1: {
          $id: "1",
          id: 1,
          name: "Harry Q. Bovik",
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: []
        }
      },
      groups: {},
      users_groups: {},
      user_profiles: {},
      user_profile_attributes: {}
    });
  });

  it("runs the `destroy` action", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    User.insertOrUpdate({
      data: {
        id: 1,
        name: "Harry Bovik"
      }
    });

    mock.onDelete("/api/users/1").reply(204);

    expect(await User.jsonApi().destroy(1)).toBe(null);

    assertState(store, {
      users: {},
      groups: {},
      users_groups: {},
      user_profiles: {},
      user_profile_attributes: {}
    });

    User.insertOrUpdate({
      data: {
        id: 1,
        name: "Harry Bovik"
      }
    });

    mock.onDelete("/api/users/1").reply(200, {});

    expect(await User.jsonApi().destroy(1)).toBe(null);

    assertState(store, {
      users: {},
      groups: {},
      users_groups: {},
      user_profiles: {},
      user_profile_attributes: {}
    });
  });

  it("throws an error when expected multiplicity is one", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    mock.onGet("/api/users/1").reply(200, {
      data: [
        {id: 1, type: "users", attributes: {name: "Harry Bovik"}},
        {id: 2, type: "users", attributes: {name: "Allen Newell"}},
        {id: 3, type: "users", attributes: {name: "Herb Simon"}}
      ]
    });

    await expect(User.jsonApi().show(1)).rejects.toThrow(
      Utils.error("Expected an object JSON:API response, but got an array or nothing instead")
    );
  });

  it("throws an error when expected multiplicity is many", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    mock.onGet("/api/users").reply(200, {
      data: {
        id: 1, type: "users", attributes: {name: "Harry Bovik"}
      }
    });

    await expect(User.jsonApi().index()).rejects.toThrow(
      Utils.error("Expected an array JSON:API response, but got an object or nothing instead")
    );
  });

  it("applies a user-defined query scope", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
    const {users: User} = store.$db().models();

    mock.onGet("/api/users/1").reply(200, {
      data: {
        id: 1,
        type: "users",
        attributes: {
          name: "Harry Bovik"
        },
        relationships: {
          "users-groups": {
            data: [
              {id: 1, type: "users-groups"}
            ]
          }
        }
      },
      included: [
        {
          id: 1,
          type: "users-groups",
          relationships: {
            group: {
              data: {
                id: 1,
                type: "groups"
              }
            }
          }
        },
        {id: 1, type: "groups", attributes: {name: "CMU"}}
      ]
    });

    const user = await User.jsonApi().show(1, {scope: (query) => query.with("users_groups.group")});

    expect(user).toEqual({
      $id: "1",
      id: 1,
      name: "Harry Bovik",
      users_groups: [
        {
          $id: "[1,1]",
          id: 1,
          user_id: 1,
          user: null,
          group_id: 1,
          group: {
            $id: "1",
            id: 1,
            name: "CMU",
            users: [],
            users_groups: []
          }
        }
      ],
      groups: [],
      user_profile: null,
      user_profile_attributes: [],
      embedded_group_ids: null,
      embedded_groups: []
    });
  });
});
