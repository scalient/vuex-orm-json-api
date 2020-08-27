import InsertionStore from '../InsertionStore';
import Utils from '../Utils';

export default class {
  constructor(database, config) {
    this.database = database;
    this.resourceToEntityCase = config.resourceToEntityCase;
  }

  transform(data) {
    let insertionStore = new InsertionStore();
    let primaryData = data.data;

    if (primaryData instanceof Array) {
      primaryData.forEach((data) => this.transformResource(data, insertionStore, true));
    } else {
      this.transformResource(primaryData, insertionStore, true);
    }

    let includedData = data.included || [];
    includedData.forEach((data) => this.transformResource(data, insertionStore, false));

    if (primaryData instanceof Array) {
      return {
        data: insertionStore.recordQueue.filter((record) => record.isPrimary),
        included: insertionStore.recordQueue.filter((record) => !record.isPrimary),
      };
    } else {
      let primaryRecords = insertionStore.recordQueue.filter((record) => record.isPrimary);

      if (primaryRecords.length !== 1) {
        throw Utils.error('Expected singleton array for pre-insertion records');
      }

      return {
        data: primaryRecords[0],
        included: insertionStore.recordQueue.filter((record) => !record.isPrimary),
      };
    }
  }

  transformResource(data, insertionStore, isPrimary) {
    // Convert JSON:API casing to Vuex ORM casing and look up the model.
    let type = this.resourceToEntityCase(data.type);
    let model = Utils.modelFor(this.database, type);
    let resourceId = data.id;
    let localKey = model.localKey();
    let record = insertionStore.fetchRecord(type, resourceId, localKey);

    /*
     * This record may have started life as non-primary, and the `DocumentTransformer` has the authoritative say on
     * whether it is primary.
     */
    record.isPrimary = isPrimary;

    model.jsonApiTransformer.transform(data, record.data, insertionStore);
  }
}
