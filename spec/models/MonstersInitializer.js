export default class {
  static initialize({monsters}) {
    monsters.entity = 'monsters';

    monsters.fields = function () {
      return {
        id: this.attr(null),
        name: this.attr(null),

        scaree_id: this.attr(null),
        scaree_type: this.attr(null),
        scaree: this.morphTo('scaree_id', 'scaree_type'),
      };
    };
  }
}
