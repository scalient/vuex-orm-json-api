export default class {
  static initialize({inhabitables, people}) {
    Object.assign(inhabitables, {
      entity: 'inhabitables',

      fields() {
        return {
          id: this.attr(null),

          person_id: this.attr(null),
          person: this.belongsTo(people, 'person_id'),

          inhabitable_id: this.attr(null),
          inhabitable_type: this.attr(null),
          inhabitable: this.morphTo('inhabitable_id', 'inhabitable_type'),
        };
      },
    });
  }
}
