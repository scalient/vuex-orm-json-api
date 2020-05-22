export default class {
  static initialize({user_profiles, users}) {
    user_profiles.entity = "user_profiles";

    user_profiles.fields = function () {
      return {
        id: this.attr(null),

        user_id: this.attr(null),
        user: this.belongsTo(users, "user_id")
      };
    };
  }
}
