export default class {
  static initialize({user_profiles, users}) {
    Object.assign(user_profiles, {
      entity: 'user_profiles',

      fields() {
        return {
          id: this.attr(null),

          user_id: this.attr(null),
          user: this.belongsTo(users, 'user_id'),
        };
      },
    });
  }
}
