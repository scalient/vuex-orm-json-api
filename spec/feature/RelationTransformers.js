import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {describe, it, beforeEach, afterEach, expect} from '@jest/globals';
import {createStore, assertState} from 'spec/support/spec_helper';
import ModelFactory from '../models/ModelFactory';
import Utils from '../../src/Utils';

describe('Feature - Relation Transformers', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('transforms the `BelongsTo` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {users_groups: UsersGroup} = store.$db().models();

    mock.onGet('/api/users_groups/1').reply(200, {
      data: {
        id: 1,
        type: 'users-groups',
        relationships: {
          user: {
            data: {id: 1, type: 'users'},
          },
          group: {
            data: {id: 1, type: 'groups'},
          },
        },
      },
      included: [
        {id: 1, type: 'users', attributes: {name: 'Harry Bovik'}},
        {id: 1, type: 'groups', attributes: {name: 'CMU'}},
      ],
    });

    await UsersGroup.jsonApi().show(1);

    // This is also testing that the explicit `id` mandated by JSON:API can coexist with the true, composite key `$id`.
    assertState(store, {
      users: {
        1: {
          $id: '1',
          id: 1,
          name: 'Harry Bovik',
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: [],
        },
      },
      groups: {
        1: {$id: '1', id: 1, name: 'CMU', users_groups: [], users: []},
      },
      users_groups: {
        '[1,1]': {$id: '[1,1]', id: 1, user_id: 1, user: null, group_id: 1, group: null},
      },
    });
  });

  it('transforms the `HasMany` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {users: User} = store.$db().models();

    mock.onGet('/api/users/1').reply(200, {
      data: {
        id: 1,
        type: 'users',
        attributes: {
          name: 'Harry Bovik',
        },
        relationships: {
          'users-groups': {
            data: [
              {id: 1, type: 'users-groups'},
            ],
          },
        },
      },
      included: [
        {
          id: 1, type: 'users-groups',
          relationships: {
            group: {
              data: {id: 1, type: 'groups'},
            },
          },
        },
        {id: 1, type: 'groups', attributes: {name: 'CMU'}},
      ],
    });

    await User.jsonApi().show(1);

    /*
     * This is also testing `InsertionStore`'s ability to make the `UsersGroup` record available for relational
     * manipulation by both the `User` and `Group` record, thus correctly populating the `user_id` and `group_id`
     * attributes, thus ensuring that the `['user_id', 'group_id']` primary key can be generated.
     */
    assertState(store, {
      users: {
        1: {
          $id: '1',
          id: 1,
          name: 'Harry Bovik',
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: [],
        },
      },
      groups: {
        1: {$id: '1', id: 1, name: 'CMU', users_groups: [], users: []},
      },
      users_groups: {
        '[1,1]': {$id: '[1,1]', id: 1, user_id: 1, user: null, group_id: 1, group: null},
      },
    });
  });

  it('transforms the `HasManyBy` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {users: User} = store.$db().models();

    mock.onGet('/api/users/1').reply(200, {
      data: {
        id: 1,
        type: 'users',
        attributes: {
          name: 'Harry Bovik',
        },
        relationships: {
          embedded_groups: {
            data: [
              {id: 1, type: 'groups'},
              {id: 2, type: 'groups'},
              {id: 3, type: 'groups'},
            ],
          },
        },
      },
      included: [
        {id: 1, type: 'groups', attributes: {name: 'A'}},
        {id: 2, type: 'groups', attributes: {name: 'B'}},
        {id: 3, type: 'groups', attributes: {name: 'C'}},
      ],
    });

    await User.jsonApi().show(1);

    assertState(store, {
      users: {
        1: {
          $id: '1',
          id: 1,
          name: 'Harry Bovik',
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: [1, 2, 3],
          embedded_groups: [],
        },
      },
      groups: {
        1: {$id: '1', id: 1, name: 'A', users_groups: [], users: []},
        2: {$id: '2', id: 2, name: 'B', users_groups: [], users: []},
        3: {$id: '3', id: 3, name: 'C', users_groups: [], users: []},
      },
    });
  });

  it('transforms the `BelongsToMany` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {users: User} = store.$db().models();

    mock.onGet('/api/users/1').reply(200, {
      data: {
        id: 1,
        type: 'users',
        attributes: {
          name: 'Harry Bovik',
        },
        relationships: {
          groups: {
            data: [
              {id: 1, type: 'groups'},
              {id: 2, type: 'groups'},
              {id: 3, type: 'groups'},
            ],
          },
        },
      },
      included: [
        {id: 1, type: 'groups', attributes: {name: 'A'}},
        {id: 2, type: 'groups', attributes: {name: 'B'}},
        {id: 3, type: 'groups', attributes: {name: 'C'}},
      ],
    });

    await User.jsonApi().show(1);

    assertState(store, {
      users: {
        1: {
          $id: '1',
          id: 1,
          name: 'Harry Bovik',
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: [],
        },
      },
      groups: {
        1: {$id: '1', id: 1, name: 'A', users_groups: [], users: []},
        2: {$id: '2', id: 2, name: 'B', users_groups: [], users: []},
        3: {$id: '3', id: 3, name: 'C', users_groups: [], users: []},
      },
      users_groups: {
        '[1,1]': {$id: '[1,1]', id: null, user_id: 1, user: null, group_id: 1, group: null},
        '[1,2]': {$id: '[1,2]', id: null, user_id: 1, user: null, group_id: 2, group: null},
        '[1,3]': {$id: '[1,3]', id: null, user_id: 1, user: null, group_id: 3, group: null},
      },
    });
  });

  it('transforms the `HasOne` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {users: User} = store.$db().models();

    mock.onGet('/api/users/1').reply(200, {
      data: {
        id: 1,
        type: 'users',
        attributes: {
          name: 'Harry Bovik',
        },
        relationships: {
          'user-profile': {
            data: {
              id: 1,
              type: 'user-profiles',
            },
          },
        },
      },
      included: [
        {id: 1, type: 'user-profiles'},
      ],
    });

    await User.jsonApi().show(1);

    assertState(store, {
      users: {
        1: {
          $id: '1',
          id: 1,
          name: 'Harry Bovik',
          users_groups: [],
          groups: [],
          user_profile: null,
          user_profile_attributes: [],
          embedded_group_ids: null,
          embedded_groups: [],
        },
      },
      user_profiles: {
        1: {$id: '1', id: 1, user_id: 1, user: null},
      },
    });
  });

  it('refuses to transform the `HasManyThrough` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {users: User} = store.$db().models();

    mock.onGet('/api/users/1').reply(200, {
      data: {
        id: 1,
        type: 'users',
        attributes: {
          name: 'Harry Bovik',
        },
        relationships: {
          'user-profile-attributes': {
            data: [
              {
                id: 1,
                type: 'user-profile-attributes',
              },
            ],
          },
        },
      },
      included: [
        {id: 1, type: 'user-profile-attributes'},
      ],
    });

    await expect(User.jsonApi().show(1)).rejects.toThrow(
      Utils.error('Writing directly to a `HasManyThrough` relation is not supported'),
    );
  });

  it('transforms the `morphToMany` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {offices: Office} = store.$db().models();

    mock.onGet('/api/offices').reply(200, {
      data: [
        {
          id: 1,
          type: 'offices',
          attributes: {
            name: 'Newell Simon Hall',
          },
          relationships: {
            people: {
              data: [
                {id: 1, type: 'people'},
                {id: 2, type: 'people'},
                {id: 3, type: 'people'},
              ],
            },
          },
        },
        {
          id: 2,
          type: 'offices',
          attributes: {
            name: 'Wean Hall',
          },
          relationships: {
            people: {
              data: [
                {id: 3, type: 'people'},
              ],
            },
          },
        },
      ],
      included: [
        {id: 1, type: 'people', attributes: {name: 'Allen Newell'}},
        {id: 2, type: 'people', attributes: {name: 'Herb Simon'}},
        {id: 3, type: 'people', attributes: {name: 'Harry Bovik'}},
      ],
    });

    await Office.jsonApi().index();

    assertState(store, {
      people: {
        1: {$id: '1', id: 1, type: null, name: 'Allen Newell'},
        2: {$id: '2', id: 2, type: null, name: 'Herb Simon'},
        3: {$id: '3', id: 3, type: null, name: 'Harry Bovik'},
      },
      offices: {
        1: {$id: '1', id: 1, people: [], name: 'Newell Simon Hall'},
        2: {$id: '2', id: 2, people: [], name: 'Wean Hall'},
      },
      inhabitables: {
        '1_1_offices': {
          $id: '1_1_offices', id: null, inhabitable_id: 1, inhabitable_type: 'offices', person_id: 1,
          inhabitable: null, person: null,
        },
        '1_2_offices': {
          $id: '1_2_offices', id: null, inhabitable_id: 1, inhabitable_type: 'offices', person_id: 2,
          inhabitable: null, person: null,
        },
        '1_3_offices': {
          $id: '1_3_offices', id: null, inhabitable_id: 1, inhabitable_type: 'offices', person_id: 3,
          inhabitable: null, person: null,
        },
        '2_3_offices': {
          $id: '2_3_offices', id: null, inhabitable_id: 2, inhabitable_type: 'offices', person_id: 3,
          inhabitable: null, person: null,
        },
      },
    });
  });

  it('transforms the `morphedByMany` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {adults: Adult} = store.$db().models();

    mock.onGet('/api/adults').reply(200, {
      data: [
        {
          id: 1,
          type: 'adults',
          attributes: {
            name: 'Allen Newell',
          },
          relationships: {
            houses: {
              data: [
                {id: 1, type: 'houses'},
              ],
            },
            offices: {
              data: [
                {id: 1, type: 'offices'},
              ],
            },
          },
        },
        {
          id: 2,
          type: 'adults',
          attributes: {
            name: 'Herb Simon',
          },
          relationships: {
            houses: {
              data: [
                {id: 2, type: 'houses'},
              ],
            },
            offices: {
              data: [
                {id: 1, type: 'offices'},
              ],
            },
          },
        },
      ],
      included: [
        {id: 1, type: 'houses', attributes: {name: 'Allen\'s House'}},
        {id: 2, type: 'houses', attributes: {name: 'Herb\'s House'}},
        {id: 1, type: 'offices', attributes: {name: 'Newell Simon Hall'}},
      ],
    });

    await Adult.jsonApi().index();

    assertState(store, {
      people: {
        1: {$id: '1', id: 1, type: 'adults', houses: [], offices: [], name: 'Allen Newell'},
        2: {$id: '2', id: 2, type: 'adults', houses: [], offices: [], name: 'Herb Simon'},
      },
      houses: {
        1: {$id: '1', id: 1, people: [], name: 'Allen\'s House'},
        2: {$id: '2', id: 2, people: [], name: 'Herb\'s House'},
      },
      offices: {
        1: {$id: '1', id: 1, people: [], name: 'Newell Simon Hall'},
      },
      inhabitables: {
        '1_1_houses': {
          $id: '1_1_houses', id: null, inhabitable_id: 1, inhabitable_type: 'houses', person_id: 1,
          inhabitable: null, person: null,
        },
        '2_2_houses': {
          $id: '2_2_houses', id: null, inhabitable_id: 2, inhabitable_type: 'houses', person_id: 2,
          inhabitable: null, person: null,
        },
        '1_1_offices': {
          $id: '1_1_offices', id: null, inhabitable_id: 1, inhabitable_type: 'offices', person_id: 1,
          inhabitable: null, person: null,
        },
        '1_2_offices': {
          $id: '1_2_offices', id: null, inhabitable_id: 1, inhabitable_type: 'offices', person_id: 2,
          inhabitable: null, person: null,
        },
      },
    });
  });

  it('transforms the `morphTo` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {toys: Toy} = store.$db().models();

    mock.onGet('/api/toys/1').reply(200, {
      data: {
        id: 1,
        type: 'toys',
        attributes: {
          name: 'Sheriff Woody',
        },
        relationships: {
          owner: {
            data: {id: 1, type: 'children'},
          },
        },
      },
      included: [
        {id: 1, type: 'children', attributes: {name: 'Andy'}},
      ],
    });

    await Toy.jsonApi().show(1);

    assertState(store, {
      toys: {
        1: {$id: '1', id: 1, owner_id: 1, owner_type: 'children', name: 'Sheriff Woody', owner: null},
      },
      people: {
        '1': {$id: '1', id: 1, type: 'children', name: 'Andy', toys: [], monster_in_the_closet: null},
      },
    });
  });

  it('transforms the `morphMany` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {children: Child} = store.$db().models();

    mock.onGet('/api/children/1').reply(200, {
      data: {
        id: 1,
        type: 'children',
        attributes: {
          name: 'Andy',
        },
        relationships: {
          toys: {
            data: [
              {id: 1, type: 'toys'},
              {id: 2, type: 'toys'},
              {id: 3, type: 'toys'},
            ],
          },
        },
      },
      included: [
        {id: 1, type: 'toys', attributes: {name: 'Sheriff Woody'}},
        {id: 2, type: 'toys', attributes: {name: 'Buzz Lightyear'}},
        {id: 3, type: 'toys', attributes: {name: 'Bo Peep'}},
      ],
    });

    await Child.jsonApi().show(1);

    assertState(store, {
      people: {
        '1': {$id: '1', id: 1, type: 'children', name: 'Andy', toys: [], monster_in_the_closet: null},
      },
      toys: {
        1: {$id: '1', id: 1, owner_id: 1, owner_type: 'children', name: 'Sheriff Woody', owner: null},
        2: {$id: '2', id: 2, owner_id: 1, owner_type: 'children', name: 'Buzz Lightyear', owner: null},
        3: {$id: '3', id: 3, owner_id: 1, owner_type: 'children', name: 'Bo Peep', owner: null},
      },
    });
  });

  it('transforms the `morphOne` relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {children: Child} = store.$db().models();

    mock.onGet('/api/children/1').reply(200, {
      data: {
        id: 1,
        type: 'children',
        attributes: {
          name: 'Boo',
        },
        relationships: {
          'monster-in-the-closet': {
            data: {id: 1, type: 'monsters'},
          },
        },
      },
      included: [
        {id: 1, type: 'monsters', attributes: {name: 'Sully'}},
      ],
    });

    await Child.jsonApi().show(1);

    assertState(store, {
      people: {
        '1': {$id: '1', id: 1, type: 'children', name: 'Boo', toys: [], monster_in_the_closet: null},
      },
      monsters: {
        1: {$id: '1', id: 1, scaree_id: 1, scaree_type: 'children', name: 'Sully', scaree: null},
      },
    });
  });
});
