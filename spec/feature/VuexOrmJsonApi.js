import {describe, expect, it} from '@jest/globals';
import {createStore} from 'spec/support/spec_helper';
import ModelFactory from '../models/ModelFactory';

describe('Feature - Vuex ORM JSON:API', () => {
  it('mixes the adapter\'s configuration into models', () => {
    let store = createStore(ModelFactory.presets);
    let {users: User} = store.$db().models();

    expect(User).toHaveProperty('setAxios');
    expect(User).toHaveProperty('globalJsonApiConfig');
    expect(User).toHaveProperty('jsonApiConfig');
    expect(User).toHaveProperty('jsonApi');
  });
});
