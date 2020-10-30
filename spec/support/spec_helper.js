import axios from 'axios';
import Vue from 'vue';
import Vuex, {Store} from 'vuex';
import VuexORM from '@vuex-orm/core';
import VuexOrmJsonApi, {RestfulActionsMixin} from '@/index';
import {expect} from '@jest/globals';
import ModelFactory from '../models/ModelFactory';

Vue.use(Vuex);

VuexORM.use(VuexOrmJsonApi, {axios, mixins: [RestfulActionsMixin]});

export function createStore(entitiesToBaseEntities) {
  return new Store({
    plugins: [VuexORM.install(ModelFactory.createDatabase(entitiesToBaseEntities))],
    strict: true,
  });
}

export function createState(entitiesToData) {
  return {
    $name: 'entities',

    ...Object.keys(entitiesToData).reduce((carry, name) => {
      const data = entitiesToData[name];

      carry[name] = {
        $connection: 'entities',
        $name: name,
        data,
      };

      return carry;
    }, {}),
  };
}

export function assertState(store, entitiesToData) {
  let missingEntitiesToData = Object.fromEntries(
    Object.
      keys(store.state.entities).
      filter(entity => !Object.prototype.hasOwnProperty.call(entitiesToData, entity)).map(entity => [entity, {}]),
  );

  // Excise the special `$name` property.
  let {['$name']: _, ...remaining} = missingEntitiesToData;
  missingEntitiesToData = remaining;

  expect(store.state.entities).toEqual(createState({...entitiesToData, ...missingEntitiesToData}));
}
