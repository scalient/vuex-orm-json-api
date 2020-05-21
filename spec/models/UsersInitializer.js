export default class {
  static initialize({users, users_groups}) {
    users.entity = "users";

    users.fields = function () {
      return {
        id: this.attr(null),
        name: this.attr(null),

        users_groups: this.hasMany(users_groups, "user_id")
      };
    };
  }
}
