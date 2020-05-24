import {Model} from "@vuex-orm/core";
import groups_initializer from "./GroupsInitializer";
import users_initializer from "./UsersInitializer";
import users_groups_initializer from "./UsersGroupsInitializer";
import user_profiles_initializer from "./UserProfilesInitializer";
import user_profile_attributes_initializer from "./UserProfileAttributesInitializer";
import people_initializer from "./PeopleInitializer";
import inhabitables_initializer from "./InhabitablesInitializer";
import houses_initializer from "./HousesInitializer";
import offices_initializer from "./OfficesInitializer";
import children_initializer from "./ChildrenInitializer";
import toys_initializer from "./ToysInitializer";
import monsters_initializer from "./MonstersInitializer";

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
    children_initializer,
    toys_initializer,
    monsters_initializer
  }

  static presetClusters = {
    // Used to test the `BelongsTo`, `HasMany`, `HasManyBy`, `BelongsToMany`, `HasOne`, and `HasManyThrough` relations.
    usersAndGroups: ["users", "groups", "users_groups", "user_profiles", "user_profile_attributes"],
    // Used to test the `MorphToMany` and `MorphedByMany` relations.
    peopleAndInhabitables: ["people", "inhabitables", "houses", "offices"],
    // Used to test the `MorphTo`, `MorphMany`, and `MorphOne` relations.
    childrenAndToysAndMonsters: ["children", "toys", "monsters"]
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
