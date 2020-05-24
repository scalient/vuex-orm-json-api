import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {describe, it, beforeEach, afterEach} from "@jest/globals";
import {createStore, assertState} from "spec/support/spec_helper";
import ModelFactory from "../models/ModelFactory";

describe("Feature - Relation Transformers", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("transforms the `BelongsTo` relation", async () => {
    const store = createStore(...ModelFactory.presetClusters.usersAndGroups);
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
        1: {$id: "1", id: 1, name: "Harry Bovik", users_groups: [], groups: [], user_profile: null}
      },
      groups: {
        1: {$id: "1", id: 1, name: "CMU", users_groups: [], users: []}
      },
      users_groups: {
        "[1,1]": {$id: "[1,1]", id: 1, user_id: 1, user: null, group_id: 1, group: null}
      },
      user_profiles: {}
    });
  });

  it("transforms the `BelongsToMany` relation", async () => {
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
        1: {$id: "1", id: 1, name: "Harry Bovik", users_groups: [], groups: [], user_profile: null}
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
      },
      user_profiles: {}
    });
  });

  it("transforms the `HasOne` relation", async () => {
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
          "user-profile": {
            data: {
              id: 1,
              type: "user-profiles"
            }
          }
        }
      },
      included: [
        {id: 1, type: "user-profiles"}
      ]
    });

    await User.jsonApi().show(1);

    assertState(store, {
      users: {
        1: {$id: "1", id: 1, name: "Harry Bovik", users_groups: [], groups: [], user_profile: null}
      },
      user_profiles: {
        1: {$id: "1", id: 1, user_id: 1, user: null}
      },
      groups: {},
      users_groups: {}
    });
  });

  it("transforms the `morphToMany` relation", async () => {
    const store = createStore(...ModelFactory.presetClusters.peopleAndInhabitables);
    const {offices: Office} = store.$db().models();

    mock.onGet("/api/offices").reply(200, {
      data: [
        {
          id: 1,
          type: "offices",
          attributes: {
            name: "Newell Simon Hall"
          },
          relationships: {
            people: {
              data: [
                {id: 1, type: "people"},
                {id: 2, type: "people"},
                {id: 3, type: "people"}
              ]
            }
          }
        },
        {
          id: 2,
          type: "offices",
          attributes: {
            name: "Wean Hall"
          },
          relationships: {
            people: {
              data: [
                {id: 3, type: "people"}
              ]
            }
          }
        }
      ],
      included: [
        {id: 1, type: "people", attributes: {name: "Allen Newell"}},
        {id: 2, type: "people", attributes: {name: "Herb Simon"}},
        {id: 3, type: "people", attributes: {name: "Harry Bovik"}}
      ]
    });

    await Office.jsonApi().index();

    assertState(store, {
      people: {
        1: {$id: "1", id: 1, houses: [], offices: [], name: "Allen Newell"},
        2: {$id: "2", id: 2, houses: [], offices: [], name: "Herb Simon"},
        3: {$id: "3", id: 3, houses: [], offices: [], name: "Harry Bovik"}
      },
      offices: {
        1: {$id: "1", id: 1, people: [], name: "Newell Simon Hall"},
        2: {$id: "2", id: 2, people: [], name: "Wean Hall"},
      },
      inhabitables: {
        "1_1_offices": {
          $id: "1_1_offices", id: null, inhabitable_id: 1, inhabitable_type: "offices", person_id: 1,
          inhabitable: null, person: null
        },
        "1_2_offices": {
          $id: "1_2_offices", id: null, inhabitable_id: 1, inhabitable_type: "offices", person_id: 2,
          inhabitable: null, person: null
        },
        "1_3_offices": {
          $id: "1_3_offices", id: null, inhabitable_id: 1, inhabitable_type: "offices", person_id: 3,
          inhabitable: null, person: null
        },
        "2_3_offices": {
          $id: "2_3_offices", id: null, inhabitable_id: 2, inhabitable_type: "offices", person_id: 3,
          inhabitable: null, person: null
        },
      },
      houses: {}
    });
  });
});
