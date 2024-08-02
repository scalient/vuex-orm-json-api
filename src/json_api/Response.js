import Utils from '../Utils';
import DocumentTransformer from '../transformers/DocumentTransformer';

export default class {
  /**
   * Create a new response instance.
   */
  constructor(model, response, config) {
    this.model = model;
    this.response = response;
    this.config = config;
    this.documentTransformer = new DocumentTransformer(model.database(), config);

    let responseData = this.response.data;

    if (responseData) {
      (
        {
          meta: this.meta,
          jsonapi: this.jsonapi,
          links: this.links,
        } = responseData
      );
    }
  }

  /**
   * Commit response data to the store, potentially returning newly inserted records.
   */
  async commit() {
    let database = this.model.database();
    let responseData = this.response.data;

    let insertionStore = null;
    let primaryData = responseData?.data;

    if (primaryData) {
      insertionStore = this.documentTransformer.transform(responseData);
    }

    let multiplicity = this.config.multiplicity;

    if (!multiplicity) {
      if (primaryData instanceof Array) {
        multiplicity = 'many';
      } else if (primaryData) {
        multiplicity = 'one';
      } else {
        multiplicity = 'none';
      }
    }

    let scope = this.config.scope;

    switch (multiplicity) {
      case 'many':
        if (!(primaryData instanceof Array) || !primaryData) {
          throw Utils.error('Expected an array JSON:API response, but got an object or nothing instead');
        }

        return await this.commitResources(database, primaryData, insertionStore, scope);
      case 'one':
        if (primaryData instanceof Array || !primaryData) {
          throw Utils.error('Expected an object JSON:API response, but got an array or nothing instead');
        }

        return await this.commitResource(database, primaryData, insertionStore, scope);
      case 'none':
        if (primaryData) {
          throw Utils.error('Expected nothing for the JSON:API response\'s primary data, but got something instead');
        }

        if (this.config.id) {
          await this.deleteRecord(this.config.id);
        }

        return null;
      default:
        throw Utils.error('Control should never reach here');
    }
  }

  /**
   * Finds the newly upserted record from the given resource.
   */
  findRecordFromResource(database, jsonApiResource, insertionStore, scope) {
    let entity = this.documentTransformer.resourceToEntityCase(jsonApiResource.type);
    let record = insertionStore.findRecord(entity, jsonApiResource.id);

    let model = Utils.modelFor(database, entity);
    let primaryKey = model.primaryKey;
    let primaryKeyValue;

    if (!(primaryKey instanceof Array)) {
      primaryKeyValue = record[primaryKey];
    } else {
      primaryKeyValue = primaryKey.map((keyComponent) => record[keyComponent]);
    }

    let query = model.query().whereId(primaryKeyValue);

    if (scope) {
      scope(query);
    }

    return query.first();
  }

  /**
   * Commits multiple JSON:API resources.
   */
  async commitResources(database, primaryData, insertionStore, scope) {
    const promises = Array();

    insertionStore.forEachType((entity, idsToRecords) =>
      promises.push(Utils.modelFor(database, entity).insertOrUpdate({data: Object.values(idsToRecords)}))
    );

    await Promise.all(promises);

    return primaryData.map((data) => this.findRecordFromResource(database, data, insertionStore, scope));
  }

  /**
   * Commits a JSON:API resource.
   */
  async commitResource(database, primaryData, insertionStore, scope) {
    const promises = Array();

    insertionStore.forEachType((entity, idsToRecords) =>
      promises.push(Utils.modelFor(database, entity).insertOrUpdate({data: Object.values(idsToRecords)}))
    );

    await Promise.all(promises);

    return this.findRecordFromResource(database, primaryData, insertionStore, scope);
  }

  /**
   * Deletes a record.
   */
  async deleteRecord(id) {
    await this.model.delete(id);
  }
}
