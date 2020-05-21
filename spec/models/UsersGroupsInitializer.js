export default class {
  static initialize({users_groups, users, groups}) {
    users_groups.entity = "users_groups";

    users_groups.fields = function () {
      return {
        id: this.attr(null),

        user_id: this.attr(null),
        user: this.belongsTo(users, "user_id"),

        group_id: this.attr(null),
        group: this.belongsTo(groups, "group_id")
      };
    };
  }
}
