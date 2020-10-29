export default class {
  static initialize({children, toys, monsters}) {
    Object.assign(children, {
      entity: 'children',

      fields() {
        return {
          id: this.attr(null),
          name: this.attr(null),

          toys: this.morphMany(toys, 'owner_id', 'owner_type'),

          monster_in_the_closet: this.morphOne(monsters, 'scaree_id', 'scaree_type'),
        };
      },
    });
  }
}
