import Utils from './Utils';

/**
 * A holding area for pre-insertion Vuex ORM records that are meant to be shared and manipulated relationally across
 * multiple resources in the JSON:API document.
 */
export default class {
  constructor() {
    this.typesToIdsToRecords = {};
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
      record = {[localKey ? localKey : 'id']: id};
      records[id] = record;
    }

    return record;
  }

  /**
   * Iterates over each type and calls the given function, passing in the type and the associated ids-to-records hash.
   */
  forEachType(fn) {
    for (const [type, idsToRecords] of Object.entries(this.typesToIdsToRecords)) {
      fn(type, idsToRecords);
    }
  }

  /**
   * Finds a record of the given type and id.
   */
  findRecord(type, id) {
    let idsToRecords = this.typesToIdsToRecords[type];
    let record = idsToRecords && idsToRecords[id];

    if (!record) {
      throw Utils.error(`Record with (type, id) = (\`${type}\`, \`${id}\`) not found`);
    }

    return record;
  }
}
