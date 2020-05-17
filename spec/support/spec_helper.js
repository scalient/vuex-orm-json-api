import axios from "axios";
import Vue from "vue";
import Vuex, {Store} from "vuex";
import VuexORM, {Database} from "@vuex-orm/core";
import VuexOrmJsonApi from "@/index";

import {expect} from "@jest/globals";

Vue.use(Vuex);

export function createStore(models) {
  VuexORM.use(VuexOrmJsonApi, {axios});

  const database = new Database();

  models.forEach((model) => database.register(model));

  return new Store({
    plugins: [VuexORM.install(database)],
    strict: true
  });
}

export function createState(entities) {
  return {
    $name: "entities",

    ...Object.keys(entities).reduce((carry, name) => {
      const data = entities[name];

      carry[name] = {
        $connection: "entities",
        $name: name,
        data
      };

      return carry;
    }, {})
  };
}

export function assertState(store, entities) {
  expect(store.state.entities).toEqual(createState(entities));
}
