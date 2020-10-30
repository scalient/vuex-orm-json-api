import {Database, Model} from '@vuex-orm/core';
import {topologicalSort} from '../support/topological_sort';
import groups_initializer from './GroupsInitializer';
import users_initializer from './UsersInitializer';
import users_groups_initializer from './UsersGroupsInitializer';
import user_profiles_initializer from './UserProfilesInitializer';
import user_profile_attributes_initializer from './UserProfileAttributesInitializer';
import people_initializer from './PeopleInitializer';
import inhabitables_initializer from './InhabitablesInitializer';
import houses_initializer from './HousesInitializer';
import offices_initializer from './OfficesInitializer';
import adults_initializer from './AdultsInitializer';
import children_initializer from './ChildrenInitializer';
import toys_initializer from './ToysInitializer';
import monsters_initializer from './MonstersInitializer';

export default class {
  static initializers = {
    groups_initializer,
    users_initializer,
    users_groups_initializer,
    user_profiles_initializer,
    user_profile_attributes_initializer,
    people_initializer,
    inhabitables_initializer,
    houses_initializer,
    offices_initializer,
    adults_initializer,
    children_initializer,
    toys_initializer,
    monsters_initializer,
  };

  static presets = {
    users: null,
    groups: null,
    users_groups: null,
    user_profiles: null,
    user_profile_attributes: null,
    people: null,
    inhabitables: null,
    houses: null,
    offices: null,
    adults: 'people',
    children: 'people',
    toys: null,
    monsters: null,
  }

  static createDatabase(entitiesToBaseEntities) {
    let database = new Database();

    let entitiesToDeps = Object.fromEntries(
      Object.entries(entitiesToBaseEntities).map(([entity, baseEntity]) => {
        if (!baseEntity) {
          return [entity, []];
        } else {
          return [entity, [baseEntity]];
        }
      }),
    );

    let entitiesToModels = {};
    let sortedEntities = topologicalSort(entitiesToDeps).reverse();

    // Iterate over the list of entities sorted from standalone models to inherited ones.
    sortedEntities.forEach((entity) => {
      let deps = entitiesToDeps[entity];

      let model = deps.length === 0 ? class extends Model {} : class extends entitiesToModels[deps[0]] {};
      entitiesToModels[entity] = model;
    });

    sortedEntities.forEach((entity) => {
      let model = entitiesToModels[entity];

      this.initializers[`${entity}_initializer`].initialize(entitiesToModels);
      database.register(model);
    });

    return database;
  }
}
