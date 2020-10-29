export default class {
  static initialize({offices, people, inhabitables}) {
    Object.assign(offices, {
      entity: 'offices',

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
