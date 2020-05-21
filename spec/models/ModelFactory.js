import {Model} from "@vuex-orm/core";
import groups_initializer from "./GroupsInitializer";
import users_initializer from "./UsersInitializer";
import users_groups_initializer from "./UsersGroupsInitializer";

export default class {
  static initializers = {
    groups_initializer,
    users_initializer,
    users_groups_initializer
  }

  static create(...entities) {
    let context = Object.assign(...entities. //
      map((entity) => [entity, class extends Model {}]). //
      map(([key, value]) => ({[key]: value}))
    );

    return Object.assign(...entities. //
      map((entity) => {
        this.initializers[`${entity}_initializer`].initialize(context);
        return [entity, context[entity]];
      }). //
      map(([key, value]) => ({[key]: value}))
    );
  }
}
