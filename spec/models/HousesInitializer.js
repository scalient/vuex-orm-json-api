export default class {
  static initialize({houses, people, inhabitables}) {
    Object.assign(houses, {
      entity: 'houses',

      fields() {
        return {
          id: this.attr(null),
          name: this.attr(null),

          people: this.morphToMany(people, inhabitables, 'person_id', 'inhabitable_id', 'inhabitable_type'),
        };
      },
    });
  }
}
