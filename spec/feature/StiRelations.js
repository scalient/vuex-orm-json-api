import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {describe, it, beforeEach, afterEach, expect} from '@jest/globals';
import {createStore, assertState} from 'spec/support/spec_helper';
import ModelFactory from '../models/ModelFactory';
import Utils from '../../src/Utils';

describe('Feature - STI Relations', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('refuses to write an object with incompatible type to the relation', async () => {
    const store = createStore(ModelFactory.presets);
    const {meetings: Meeting} = store.$db().models();

    mock.onGet('/api/meetings/1').reply(200, {
      data: {
        id: 1,
        type: 'meetings',
        relationships: {
          chairperson: {
            data: {id: 1, type: 'toys'},
          },
        },
      },
      included: [
        {id: 1, type: 'toys', attributes: {name: 'Slinky'}},
      ],
    });

    await expect(Meeting.jsonApi().show(1)).rejects.toThrow(
      Utils.error('Expected type `adults` but got `toys` in relation'),
    );
  });

  it('writes an object with type that is a superclass or subclass of the relation type', async () => {
    const store = createStore(ModelFactory.presets);
    const {meetings: Meeting} = store.$db().models();

    mock.onGet('/api/meetings/1').reply(200, {
      data: {
        id: 1,
        type: 'meetings',
        relationships: {
          chairperson: {
            data: {id: 1, type: 'people'},
          },
          participants: {
            data: [
              {id: 1, type: 'people'},
              {id: 2, type: 'people'},
              {id: 3, type: 'children'},
            ],
          },
        },
      },
      included: [
        {id: 1, type: 'people', attributes: {type: 'Adult', name: 'Alice'}},
        {id: 2, type: 'people', attributes: {type: null, name: 'Bob'}},
        {id: 3, type: 'children', attributes: {name: 'Harry'}},
      ],
    });

    await Meeting.jsonApi().show(1);

    assertState(store, {
      meetings: {
        1: {$id: '1', id: 1, chairperson: null, participant_ids: [1, 2, 3], participants: []},
      },
      people: {
        1: {$id: '1', id: 1, type: 'Adult', name: 'Alice', offices: [], houses: []},
        2: {$id: '2', id: 2, type: null, name: 'Bob'},
        3: {$id: '3', id: 3, type: 'Child', name: 'Harry', toys: [], monster_in_the_closet: null},
      },
    });
  });

  it('preserves STI subtypes when pivot models are involved', async () => {
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
                {id: 1, type: 'adults'},
              ],
            },
          },
        },
      ],
      included: [
        {id: 1, type: 'adults', attributes: {name: 'Allen Newell'}},
      ],
    });

    await Office.jsonApi().index();

    assertState(store, {
      people: {
        1: {$id: '1', id: 1, type: 'Adult', name: 'Allen Newell', houses: [], offices: []},
      },
      offices: {
        1: {$id: '1', id: 1, people: [], name: 'Newell Simon Hall'},
      },
      inhabitables: {
        '1_1_offices': {
          $id: '1_1_offices', id: null, inhabitable_id: 1, inhabitable_type: 'offices', person_id: 1,
          inhabitable: null, person: null,
        },
      },
    });
  });
});
