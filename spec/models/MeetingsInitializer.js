export default class {
  static initialize({meetings, adults, people}) {
    Object.assign(meetings, {
      entity: 'meetings',

      fields() {
        return {
          id: this.attr(null),

          chairperson: this.belongsTo(adults, 'chairperson_id'),

          participant_ids: this.attr(null),
          participants: this.hasManyBy(people, 'participant_ids'),
        };
      },
    });
  }
}
