export default class {
  static initialize({adults, people, inhabitables, houses, offices}) {
    Object.assign(adults, {
      entity: 'adults',
      baseEntity: 'people',

      fields() {
        return {
          ...people.fields(),

          houses: this.morphedByMany(houses, inhabitables, 'person_id', 'inhabitable_id', 'inhabitable_type'),

          offices: this.morphedByMany(offices, inhabitables, 'person_id', 'inhabitable_id', 'inhabitable_type'),
        };
      },
    });
  }
}
