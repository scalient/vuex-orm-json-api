import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {describe, it, beforeEach, afterEach, expect} from '@jest/globals';
import {createStore} from 'spec/support/spec_helper';
import ModelFactory from '../models/ModelFactory';
import Utils from '../../src/Utils';

describe('Feature - Requests', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  // This isn't actually testing vuex-orm-json-api, but it's demonstrating how validation errors might be handled.
  it('throws an Axios request error with JSON:API error objects', async () => {
    const store = createStore(ModelFactory.presets);
    const {users: User} = store.$db().models();

    const payload = {
      user: {},
    };

    const responseErrors = [
      {id: 1, detail: 'Validation failed: Name can\'t be blank'},
    ];

    mock.onPost('/api/users', payload).reply(422, response);

    await expect(User.jsonApi().create(payload)).rejects.toThrow(new Error('Request failed with status code 422'));

    try {
      await User.jsonApi().create(payload);
    } catch (jsonApiError) {
      // This is the Axios error's status.
      expect(jsonApiError.cause.response.status).toBe(422);
      // This is the `JsonApiError`'s own response.
      expect(jsonApiError.response.errors).toEqual(responseErrors);
    }
  });

  it('throws a `JsonApiError` when a model can\'t be found', async () => {
    const store = createStore(ModelFactory.presets);
    const {users: User} = store.$db().models();

    mock.onGet('/api/users').reply(200, {
      data: {
        id: 1,
        type: 'things',
      },
    });

    await expect(User.jsonApi().index()).rejects.toThrow(
      Utils.error('Couldn\'t find the model for entity type `things`'),
    );
  });

  it('exposes top-level JSON:API properties like `meta` through `rawRequest`', async () => {
    const store = createStore(ModelFactory.presets);
    const {users: User} = store.$db().models();

    mock.onGet('/api/users/1').reply(200, {
      data: {
        id: 1,
        type: 'users',
      },
      meta: {
        count: 1,
      },
    });

    expect((await User.jsonApi().rawRequest({method: 'get', url: '/api/users/1'})).meta.count).toEqual(1);
  });
});
