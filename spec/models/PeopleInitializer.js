export default class {
  static initialize({people, adults, children}) {
    Object.assign(people, {
      entity: 'people',

      types() {
        return {
          Adult: adults,
          Child: children,
        };
      },

      fields() {
        return {
          id: this.attr(null),

          // The STI discriminator field.
          type: this.attr(null),

          name: this.attr(null),
        };
      },
    });
  }
}
