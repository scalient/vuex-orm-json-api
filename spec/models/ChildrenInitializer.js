export default class {
  static initialize({children, people, toys, monsters}) {
    Object.assign(children, {
      entity: 'children',
      baseEntity: 'people',

      fields() {
        return {
          ...people.fields(),

          toys: this.morphMany(toys, 'owner_id', 'owner_type'),

          monster_in_the_closet: this.morphOne(monsters, 'scaree_id', 'scaree_type'),
        };
      },
    });
  }
}
