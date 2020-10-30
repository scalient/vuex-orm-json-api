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
        {id: 1, type: 'people', attributes: {type: 'adults', name: 'Alice'}},
        {id: 2, type: 'people', attributes: {type: null, name: 'Bob'}},
        {id: 3, type: 'children', attributes: {name: 'Harry'}},
      ],
    });

    await Meeting.jsonApi().show(1);

    assertState(store, {
      meetings: {
        '1': {
          '$id': '1',
          chairperson: null,
          id: 1,
          participant_ids: [1, 2, 3],
          participants: [],
        },
      },
      people: {
        '1': {
          '$id': '1',
          houses: [],
          id: 1,
          name: 'Alice',
          offices: [],
          type: 'adults',
        },
        '2': {
          '$id': '2',
          id: 2,
          name: 'Bob',
          type: null,
        },
        '3': {
          '$id': '3',
          id: 3,
          monster_in_the_closet: null,
          name: 'Harry',
          toys: [],
          type: 'children',
        },
      },
    });
  });
});
