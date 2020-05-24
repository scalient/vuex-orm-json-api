export default class {
  static initialize({toys}) {
    toys.entity = "toys";

    toys.fields = function () {
      return {
        id: this.attr(null),
        name: this.attr(null),

        owner_id: this.attr(null),
        owner_type: this.attr(null),
        owner: this.morphTo("owner_id", "owner_type")
      };
    };
  }
}
