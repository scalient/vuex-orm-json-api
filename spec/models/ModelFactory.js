import {Model} from "@vuex-orm/core";
import groups_initializer from "./GroupsInitializer";
import users_initializer from "./UsersInitializer";
import users_groups_initializer from "./UsersGroupsInitializer";
import user_profiles_initializer from "./UserProfilesInitializer";
import people_initializer from "./PeopleInitializer";
import inhabitables_initializer from "./InhabitablesInitializer";
import houses_initializer from "./HousesInitializer";
import offices_initializer from "./OfficesInitializer";

export default class {
  static initializers = {
    groups_initializer,
    users_initializer,
    users_groups_initializer,
    user_profiles_initializer,
    people_initializer,
    inhabitables_initializer,
    houses_initializer,
    offices_initializer
  }

  static presetClusters = {
    usersAndGroups: ["users", "groups", "users_groups", "user_profiles"],
    peopleAndInhabitables: ["people", "inhabitables", "houses", "offices"]
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
