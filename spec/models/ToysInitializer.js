export default class {
  static initialize({toys}) {
    Object.assign(toys, {
      entity: 'toys',

      fields() {
        return {
          id: this.attr(null),
          name: this.attr(null),

          owner_id: this.attr(null),
          owner_type: this.attr(null),
          owner: this.morphTo('owner_id', 'owner_type'),
        };
      },
    });
  }
}
