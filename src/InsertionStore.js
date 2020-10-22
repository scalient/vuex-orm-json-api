/**
 * A holding area for pre-insertion Vuex ORM records that are meant to be shared and manipulated relationally across
 * multiple resources in the JSON:API document.
 */
export default class {
  constructor() {
    this.typesToIdsToRecords = {};
    this.records = new Set();
  }

  /*
   * Attempts to fetch the record of the given type and id. If it doesn't exist, creates, inserts, and returns a new
   * record.
   */
  fetchRecord(type, id, localKey = null) {
    let records = this.typesToIdsToRecords[type];

    if (!records) {
      records = {};
      this.typesToIdsToRecords[type] = records;
    }

    let record = records[id];

    if (!record) {
      record = {type: type, isPrimary: false, data: {[localKey ? localKey : 'id']: id}};
      records[id] = record;
    }

    // Sets provide duplicate protection and enumerate elements in insertion order, which is what we need.
    this.records.add(record);

    return record;
  }

  /**
   * Converts the underlying set of records to an array.
   */
  toArray() {
    return [...this.records];
  }
}
