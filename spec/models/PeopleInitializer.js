export default class {
  static initialize({people, inhabitables, houses, offices}) {
    people.entity = "people";

    people.fields = function () {
      return {
        id: this.attr(null),
        name: this.attr(null),

        houses: this.morphedByMany(houses, inhabitables, "person_id", "inhabitable_id", "inhabitable_type"),

        offices: this.morphedByMany(offices, inhabitables, "person_id", "inhabitable_id", "inhabitable_type")
      };
    };
  }
}
