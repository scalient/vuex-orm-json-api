export default class {
  static initialize({users, users_groups, groups, user_profiles, user_profile_attributes}) {
    Object.assign(users, {
      entity: 'users',

      fields() {
        return {
          id: this.attr(null),
          name: this.attr(null),

          users_groups: this.hasMany(users_groups, 'user_id'),

          groups: this.belongsToMany(groups, users_groups, 'user_id', 'group_id'),

          user_profile: this.hasOne(user_profiles, 'user_id'),

          user_profile_attributes: this.hasManyThrough(
            user_profile_attributes, user_profiles, 'user_id', 'user_profile_id',
          ),

          embedded_group_ids: this.attr(null),

          embedded_groups: this.hasManyBy(groups, 'embedded_group_ids'),
        };
      },
    });
  }
}
