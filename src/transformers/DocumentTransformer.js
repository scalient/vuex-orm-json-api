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
      primaryData.forEach((data) => this.transformResource(data, insertionStore));
    } else {
      this.transformResource(primaryData, insertionStore);
    }

    let includedData = data.included || [];
    includedData.forEach((data) => this.transformResource(data, insertionStore));

    return insertionStore;
  }

  transformResource(data, insertionStore) {
    // Convert JSON:API casing to Vuex ORM casing and look up the model.
    let type = this.resourceToEntityCase(data.type);
    let model = Utils.modelFor(this.database, type);
    let resourceId = data.id;
    let localKey = model.localKey();
    let record = insertionStore.fetchRecord(type, resourceId, localKey);

    model.jsonApiTransformer.transform(data, record, insertionStore);
  }
}
