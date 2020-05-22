import {Model} from "@vuex-orm/core";
import groups_initializer from "./GroupsInitializer";
import users_initializer from "./UsersInitializer";
import users_groups_initializer from "./UsersGroupsInitializer";
import user_profiles_initializer from "./UserProfilesInitializer";

export default class {
  static initializers = {
    groups_initializer,
    users_initializer,
    users_groups_initializer,
    user_profiles_initializer
  }

  static presetClusters = {
    usersAndGroups: ["users", "groups", "users_groups", "user_profiles"]
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
