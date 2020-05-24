export default class {
  static initialize({houses, people, inhabitables}) {
    houses.entity = "houses";

    houses.fields = function () {
      return {
        id: this.attr(null),
        name: this.attr(null),

        people: this.morphToMany(people, inhabitables, "person_id", "inhabitable_id", "inhabitable_type")
      };
    };
  }
}
