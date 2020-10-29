export default class {
  static initialize({users_groups, users, groups}) {
    Object.assign(users_groups, {
      entity: 'users_groups',

      primaryKey: ['user_id', 'group_id'],

      fields() {
        return {
          id: this.attr(null),

          user_id: this.attr(null),
          user: this.belongsTo(users, 'user_id'),

          group_id: this.attr(null),
          group: this.belongsTo(groups, 'group_id'),
        };
      },
    });
  }
}
